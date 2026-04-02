import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// POST /api/payment/checkout — cria pedido + cobrança Abacate Pay (requer login)
router.post("/checkout", authMiddleware, PaymentController.checkout);

export default router;
