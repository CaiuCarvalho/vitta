import { Router } from "express";
import productRoutes from "./product.routes";
import orderRoutes from "./order.routes";
import categoryRoutes from "./category.routes";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";
import paymentRoutes from "./payment.routes";
import webhookRoutes from "./webhook.routes";
import wishlistRoutes from "./wishlist.routes";
import adminRoutes from "./admin.routes";

const router = Router();

// Health check
router.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "vitta-backend" });
});

// ── API Routes ───────────────────────────────────────────────

router.use("/api/products", productRoutes);
router.use("/api/orders", orderRoutes);
router.use("/api/categories", categoryRoutes);
router.use("/api/users", userRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/payment", paymentRoutes);
router.use("/api/webhooks", webhookRoutes);
router.use("/api/wishlist", wishlistRoutes);
router.use("/api/admin", adminRoutes);

export default router;
