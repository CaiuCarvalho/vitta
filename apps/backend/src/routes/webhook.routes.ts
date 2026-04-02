import { Router } from "express";
import { WebhookController } from "../controllers/webhook.controller";

const router = Router();

// POST /api/webhooks/abacatepay — recebe eventos do gateway (sem autenticação JWT)
router.post("/abacatepay", WebhookController.abacatepay);

export default router;
