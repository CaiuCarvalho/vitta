import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { createUserSchema, updateUserSchema, updatePasswordSchema } from "../schemas/user.schema";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import addressRoutes from "./address.routes";

const router = Router();

// Public route — registration
router.post("/", validate(createUserSchema), UserController.createUser);

// Auth-protected routes
router.get("/", authMiddleware, adminMiddleware, UserController.getUsers);
router.get("/:id", authMiddleware, UserController.getUserById);
router.put("/:id", authMiddleware, validate(updateUserSchema), UserController.updateUser);
router.put("/:id/profile", authMiddleware, UserController.updateProfile);
router.put("/:id/password", authMiddleware, validate(updatePasswordSchema), UserController.updatePassword);
router.post("/:id/update-request", authMiddleware, UserController.requestUpdate);
router.post("/:id/update-confirm", authMiddleware, UserController.confirmUpdate);
router.delete("/:id", authMiddleware, adminMiddleware, UserController.deleteUser);

// Nested address routes (also auth-protected internally)
router.use("/:userId/addresses", authMiddleware, addressRoutes);

export default router;
