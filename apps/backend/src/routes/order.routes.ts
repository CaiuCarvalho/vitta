import { Router } from "express";
import { OrderController } from "../controllers/order.controller";

const router = Router();

router.get("/", OrderController.getOrders);
router.get("/:id", OrderController.getOrderById);
router.post("/", OrderController.createOrder);

export default router;

