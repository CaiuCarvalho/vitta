import { Request, Response } from "express";
import { WebhookService } from "../services/webhook.service";
import logger from "../utils/logger";

export class WebhookController {
  /**
   * POST /api/webhooks/abacatepay
   * Recebe notificações de eventos do Abacate Pay protegidas por HMAC.
   */
  static abacatepay = async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Coleta da assinatura 
      const signature = req.headers["x-abacate-signature"] as string 
                     || req.headers["authorization"]?.replace("Bearer ", "") 
                     || "";
      
      // 2. Coleta do payload bruto (Item 17: SEM fallback JSON.stringify — re-serializar gera hash diferente)
      const rawBody = (req as any).rawBody;
      if (!rawBody) {
        logger.error("[WEBHOOK] rawBody ausente — configure express.raw() ou middleware de captura de buffer.");
        res.status(400).json({ error: "Missing raw body for HMAC verification" });
        return;
      }

      // 3. Validação HMAC rigorosa
      if (!WebhookService.verifyAbacateSignature(rawBody, signature)) {
        logger.warn("[WEBHOOK] Assinatura HMAC inválida. Tentativa de invasão bloqueada.");
        res.status(401).json({ error: "Invalid HMAC signature" });
        return;
      }

      // 4. Repasse orquestrado para a camada de Service (SRP)
      // Disparamos assincronamente (evitando prender o Gateway em timeouts longos)
      WebhookService.processAbacateEvent(req.body).catch((err) => {
        logger.error(`[WEBHOOK] Falha na thread background de processamento: ${err}`);
      });

      // 5. Retorna 200 pro gateway IMEDIATAMENTE liberando o bloqueio
      res.status(200).json({ received: true });
    } catch (err: any) {
      logger.error(`[WEBHOOK] Erro no roteador principal: ${err.message}`);
      res.status(500).json({ received: false });
    }
  };
}
