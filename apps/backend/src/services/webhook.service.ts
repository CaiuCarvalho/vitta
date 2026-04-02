import crypto from "crypto";
import { OrderService } from "./order.service";
import { EmailService } from "./email.service";
import logger from "../utils/logger";

export interface AbacateEvent {
  event?: string;
  type?: string;
  data?: {
    id: string;
    status: string;
    total?: number;
    billingId?: string;
  };
  id?: string;
  status?: string;
}

export class WebhookService {
  /**
   * Valida a assinatura HMAC de webhooks (Abacate Pay).
   */
  static verifyAbacateSignature(rawBody: string, signature: string): boolean {
    const secret = process.env.ABACATE_WEBHOOK_SECRET;
    
    // Se não há secret definido, alertamos que está desprotegido, 
    // ideal para evitar crashes em debug, mas que atenda em produção.
    if (!secret) {
      logger.warn("ABACATE_WEBHOOK_SECRET ausente. Executando em ambiente inseguro (Fallback).");
      return true;
    }

    if (!signature) return false;

    try {
      const hash = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
      // Prevenir timing attacks se possível, caso contrário comparacao direta
      return hash === signature;
    } catch (err) {
      return false;
    }
  }

  /**
   * Processa o evento de alteração de Billing do Gateway
   */
  static async processAbacateEvent(event: AbacateEvent) {
    logger.info(`[WEBHOOK] Processando Evento Abacate Pay: ${JSON.stringify(event, null, 2)}`);

    const eventType = event.event ?? event.type ?? "";
    const billingData = event.data ?? event;
    const billingId = billingData.id ?? "";

    if (!billingId) {
      logger.warn("[WEBHOOK] Billing ID ausente no payload. Ignorando.");
      return;
    }

    try {
      if (
        eventType === "billing.paid" ||
        eventType === "PAID" ||
        billingData.status === "PAID"
      ) {
        const order = await OrderService.findByAbacateBillingId(billingId);

        if (!order) {
          logger.warn(`[WEBHOOK] Pedido não encontrado para billingId: ${billingId}`);
          return;
        }

        if (order.status !== "PAID") {
            await OrderService.updateOrderStatus(order.id, "PAID");
            await OrderService.decrementStock(order.id);
            logger.info(`[WEBHOOK] Pedido ${order.id} marcado como PAID e estoque baixado.`);

            try {
              const user = (order as any).user as { name: string; email: string };
              await EmailService.sendOrderConfirmationEmail(
                user.email,
                user.name,
                order.id,
                order.total
              );
              logger.info(`[WEBHOOK] Email de confirmação enviado para ${user.email}`);
            } catch (emailErr) {
              const msg = emailErr instanceof Error ? emailErr.message : "Erro desconhecido";
              logger.warn(`[WEBHOOK] Falha ao enviar email (não crítico): ${msg}`);
            }
        }
      } else if (
        eventType === "billing.expired" ||
        eventType === "EXPIRED" ||
        billingData.status === "EXPIRED"
      ) {
        const order = await OrderService.findByAbacateBillingId(billingId);
        if (order && order.status === "PENDING") {
          await OrderService.updateOrderStatus(order.id, "FAILED");
          logger.info(`[WEBHOOK] Pedido ${order.id} marcado como FAILED.`);
        }
      } else {
        logger.info(`[WEBHOOK] Evento não tratado: ${eventType}. Ignorando.`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      logger.error(`[WEBHOOK] Erro ao processar evento: ${msg}`);
      throw err;
    }
  }
}
