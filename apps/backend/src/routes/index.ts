import { Router } from "express";
import productRoutes from "./product.routes";
import orderRoutes from "./order.routes";
import categoryRoutes from "./category.routes";
import userRoutes from "./user.routes";

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

// Auth placeholders
router.post("/api/auth/login", (_req, res) => {
  res.json({ message: "Auth login — coming soon" });
});

router.post("/api/auth/register", (_req, res) => {
  res.json({ message: "Auth register — coming soon" });
});

export default router;

