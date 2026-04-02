import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const router = Router();

/**
 * Rotas Administrativas: Protegidas por Autenticação JWT e Role ADMIN.
 */
router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/stats", AdminController.getStats);
router.get("/orders", AdminController.getOrders);

export default router;
