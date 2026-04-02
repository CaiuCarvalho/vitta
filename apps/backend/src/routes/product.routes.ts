import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { validate } from "../middlewares/validate.middleware";
import { createProductSchema, updateProductSchema } from "../schemas/product.schema";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const router = Router();

// Public — anyone can browse products
router.get("/", ProductController.getProducts);
router.get("/:id", ProductController.getProductById);

// Admin-only — create, update, delete
router.post("/", authMiddleware, adminMiddleware, validate(createProductSchema), ProductController.createProduct);
router.put("/:id", authMiddleware, adminMiddleware, validate(updateProductSchema), ProductController.updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, ProductController.deleteProduct);

export default router;
