import { prisma } from "@vitta/database";
import { CreateOrderDTO } from "../dtos/order.dto";

export class OrderService {
  static async getAllOrders() {
    return prisma.order.findMany({
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getOrderById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  static async createOrder(data: CreateOrderDTO) {
    if (!data.items || data.items.length === 0) {
      throw new Error("Order must have at least one item.");
    }

    // Obtém IDs únicos e busca os produtos no banco para pegar o preço correto
    const productIds = [...new Set(data.items.map(i => i.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new Error("One or more products not found.");
    }

    // Calcula o total e prepara os orderItems
    let total = 0;
    const orderItemsRecord: { productId: string; quantity: number; unitPrice: number }[] = [];

    for (const item of data.items) {
      const product = products.find((p) => p.id === item.productId)!;
      total += product.price * item.quantity;
      orderItemsRecord.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price, // Salvando o preço no momento da compra
      });
    }

    // Cria o pedido e os itens associados numa mesma transação
    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        total,
        status: "PENDING",
        items: {
          create: orderItemsRecord,
        },
      },
      include: {
        items: true,
      },
    });

    return order;
  }
}

