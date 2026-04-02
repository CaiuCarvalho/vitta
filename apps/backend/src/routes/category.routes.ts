import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { validate } from "../middlewares/validate.middleware";
import { createCategorySchema, updateCategorySchema } from "../schemas/category.schema";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const router = Router();

// Public — anyone can browse categories
router.get("/", CategoryController.getCategories);
router.get("/slug/:slug", CategoryController.getCategoryBySlug);
router.get("/:id", CategoryController.getCategoryById);

// Admin-only — create, update, delete
router.post("/", authMiddleware, adminMiddleware, validate(createCategorySchema), CategoryController.createCategory);
router.put("/:id", authMiddleware, adminMiddleware, validate(updateCategorySchema), CategoryController.updateCategory);
router.delete("/:id", authMiddleware, adminMiddleware, CategoryController.deleteCategory);

export default router;
