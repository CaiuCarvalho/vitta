import { Router } from "express";
import { WishlistController } from "../controllers/wishlist.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Todas as rotas de favoritos requerem autenticação
router.use(authMiddleware);

router.get("/", WishlistController.getWishlist);
router.post("/toggle/:productId", WishlistController.toggleFavorite);
router.get("/check/:productId", WishlistController.checkIsFavorite);

export default router;
