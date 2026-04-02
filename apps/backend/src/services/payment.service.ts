import { prisma } from "@vitta/database";
import { AppError } from "../utils/AppError";
import { OrderService } from "./order.service";
import { AbacatePayService } from "./abacatepay.service";
import { UserService } from "./user.service";
import { validateTaxId, calculateShipping, CheckoutPayload } from "@vitta/utils";
import logger from "../utils/logger";

/**
 * PaymentService: Orquestrador do fluxo de Checkout (Brasil Fanfare)
 * Centraliza a lógica de negócio, segurança e integrações de pagamento.
 */
export class PaymentService {
  /**
   * Processa o checkout completo, do carrinho à criação da cobrança.
   */
  static async processCheckout(userId: string, payload: CheckoutPayload) {
    const { items, paymentMethod, addressId, newAddress, customer } = payload;

    logger.info(`Iniciando Checkout para usuário [${userId}] | Método: ${paymentMethod}`);

    // 1. Validar Carrinho Vazio
    if (!items || items.length === 0) {
      throw new AppError("O carrinho está vazio. Adicione itens antes de finalizar.", 400);
    }

    // 2. Buscar Dados do Usuário com Relações
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: { orderBy: { createdAt: "desc" } }
      }
    });
    if (!user) throw new AppError("Usuário não encontrado", 404);

    // 3. Gerenciamento de Endereço e Cálculo de Frete
    let shippingAddress = null;
    
    if (newAddress) {
      logger.info(`Cadastrando novo endereço para usuário [${userId}]`);
      shippingAddress = await UserService.addAddress(userId, {
        zipCode: newAddress.zipCode,
        street: newAddress.street,
        number: newAddress.number,
        complement: newAddress.complement || undefined,
        neighborhood: newAddress.neighborhood,
        city: newAddress.city,
        state: newAddress.state,
        isDefault: true
      });
    } else if (addressId) {
      shippingAddress = user.addresses.find((a) => a.id === addressId);
    } else {
      shippingAddress = user.addresses.find((a) => a.isDefault) || user.addresses[0];
    }

    if (!shippingAddress) {
      throw new AppError("Endereço de entrega é obrigatório para calcular o frete.", 400);
    }

    // 4. Validação de Produtos e Recálculo de Subtotal (Backend-side)
    logger.debug(`Validando ${items.length} itens do carrinho...`);
    const productIds = items.map(i => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    let subtotal = 0;
    const validatedItems = items.map((item) => {
      const p = dbProducts.find((dbP) => dbP.id === item.productId);
      if (!p) throw new AppError(`Produto ${item.productId} não encontrado`, 404);
      subtotal += p.price * item.quantity;
      return { ...item, unitPrice: p.price };
    });

    // 5. Cálculo Final (Seguro)
    const shippingCost = calculateShipping(shippingAddress.zipCode, subtotal);
    const total = subtotal + shippingCost;
    logger.info(`Cálculo Final: Subtotal=${subtotal} | Frete=${shippingCost} | Total=${total}`);

    // 6. Enriquecimento de Dados (Smart Checkout)
    const updates: any = {};
    const finalTaxId = (customer?.taxId || user.taxId)?.replace(/\D/g, "");
    const finalPhone = (customer?.phone || user.phone)?.replace(/\D/g, "");

    if (customer?.taxId && customer.taxId !== user.taxId) {
      if (!validateTaxId(customer.taxId)) throw new AppError("CPF ou CNPJ inválido", 400);
      updates.taxId = finalTaxId;
    }
    if (customer?.phone && customer.phone !== user.phone) {
      updates.phone = finalPhone;
    }

    if (Object.keys(updates).length > 0) {
      logger.info(`Atualizando perfil do usuário [${userId}]: %o`, updates);
      await UserService.updateProfile(userId, updates);
    }

    // 7. Bloqueio de Segurança: Dados Obrigatórios para Gateway
    if (!finalTaxId) throw new AppError("CPF/CNPJ é obrigatório para processar o pagamento.", 400);
    if (!finalPhone) throw new AppError("Telefone é obrigatório para processar o pagamento.", 400);

    // 8. Criação da Order
    const order = await OrderService.createOrder({ 
        userId, 
        items: validatedItems,
        shippingCost 
    });
    logger.info(`Order [${order.id}] criada com sucesso.`);

    // 9. Integração com Abacate Pay
    const abacateProducts = validatedItems.map((item) => {
      const p = dbProducts.find(dbP => dbP.id === item.productId)!;
      return {
        externalId: item.productId,
        name: p.name,
        quantity: item.quantity,
        price: Math.round(p.price * 100),
      };
    });

    if (shippingCost > 0) {
      abacateProducts.push({
        externalId: "shipping_fee",
        name: "Taxa de Entrega",
        quantity: 1,
        price: Math.round(shippingCost * 100),
      });
    }

    try {
      const billing = await AbacatePayService.createBilling({
        frequency: "ONE_TIME",
        methods: [paymentMethod === "CARD" ? "CARD" : "PIX"],
        returnUrl: `${process.env.FRONTEND_URL || "https://agonimports.com"}/carrinho`,
        completionUrl: `${process.env.FRONTEND_URL || "https://agonimports.com"}/pedido/confirmado?orderId=${order.id}`,
        customer: {
          name: user.name,
          email: user.email,
          cellphone: finalPhone,
          taxId: finalTaxId,
        },
        products: abacateProducts,
      });

      // 10. Atualizar Status e ID da Cobrança
      await OrderService.updateOrderStatus(order.id, "PENDING", billing.id);
      logger.info(`Checkout concluído para Order [${order.id}] | Billing [${billing.id}]`);

      return {
        orderId: order.id,
        total,
        shipping: shippingCost,
        paymentUrl: billing.url,
        pixQrCode: billing.pixQrCode ?? null,
        pixCopyPaste: billing.pixCopyPaste ?? null,
      };
    } catch (error: any) {
      logger.error(`Falha ao criar cobrança para Order [${order.id}]: %o`, error);
      throw error;
    }
  }
}
