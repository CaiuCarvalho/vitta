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
   * Item 1: Secret OBRIGATÓRIO — sem fallback inseguro.
   * Item 2: Comparação timing-safe via crypto.timingSafeEqual.
   * Item 17: rawBody deve ser string pura (não re-serializada).
   */
  static verifyAbacateSignature(rawBody: string, signature: string): boolean {
    const secret = process.env.ABACATE_WEBHOOK_SECRET;

    // Item 1 — CRÍTICO: nunca executar sem secret. Lançar erro fatal em boot se ausente.
    if (!secret) {
      logger.error("FATAL: ABACATE_WEBHOOK_SECRET não definido. Webhook endpoint inoperável.");
      return false; // Rejeitar sempre — nunca aprovar sem secret configurado
    }

    // Item 17: rawBody DEVE ser string original do buffer, nunca re-serializada via JSON.stringify
    if (!signature || typeof rawBody !== "string" || rawBody.length === 0) {
      return false;
    }

    try {
      const expectedHash = crypto
        .createHmac("sha256", secret)
        .update(rawBody, "utf8")
        .digest("hex");

      const expectedBuffer = Buffer.from(expectedHash, "hex");
      const receivedBuffer = Buffer.from(signature, "hex");

      // Item 2: Prevenir timing attacks com comparação em tempo constante
      if (expectedBuffer.length !== receivedBuffer.length) {
        return false;
      }

      return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
    } catch {
      return false;
    }
  }

  /**
   * Processa o evento de alteração de Billing do Gateway.
   * Item 8: Log reduzido — sem payload completo para não vazar dados sensíveis.
   * Item 19: Idempotência garantida pela verificação de status antes de mudar estado.
   */
  static async processAbacateEvent(event: AbacateEvent) {
    // Item 8: Log mínimo — apenas tipo e ID do evento, sem payload completo
    const eventType = event.event ?? event.type ?? "";
    const billingData = event.data ?? event;
    const billingId = billingData.id ?? "";

    logger.info(`[WEBHOOK] Evento recebido | type=${eventType} | billingId=${billingId}`);

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
          logger.warn(`[WEBHOOK] Pedido não encontrado para billingId=${billingId}`);
          return;
        }

        // Item 19: Idempotência explícita — só processa se ainda não estiver PAID
        if (order.status === "PAID") {
          logger.info(`[WEBHOOK] Pedido ${order.id} já está PAID. Ignorando evento duplicado.`);
          return;
        }

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
          logger.info(`[WEBHOOK] Email de confirmação enviado com sucesso.`);
        } catch (emailErr) {
          const msg = emailErr instanceof Error ? emailErr.message : "Erro desconhecido";
          logger.warn(`[WEBHOOK] Falha ao enviar email (não crítico): ${msg}`);
        }
      } else if (
        eventType === "billing.expired" ||
        eventType === "EXPIRED" ||
        billingData.status === "EXPIRED"
      ) {
        const order = await OrderService.findByAbacateBillingId(billingId);
        // Item 19: Idempotência — só altera se ainda PENDING
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
