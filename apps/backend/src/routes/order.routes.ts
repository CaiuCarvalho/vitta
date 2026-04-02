import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { validate } from "../middlewares/validate.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { createOrderSchema, patchTrackingSchema } from "../schemas/order.schema";

const router = Router();

router.get("/", authMiddleware, adminMiddleware, OrderController.getAllOrders);
router.get("/my", authMiddleware, OrderController.getMyOrders);
router.get("/:id", authMiddleware, OrderController.getOrderById);
router.post("/", authMiddleware, validate(createOrderSchema), OrderController.createOrder);
router.patch("/:id/tracking", authMiddleware, adminMiddleware, validate(patchTrackingSchema), OrderController.updateTracking);

export default router;
