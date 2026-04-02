import { Request, Response } from "express";
import { WishlistService } from "../services/wishlist.service";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

export class WishlistController {
  
  static getWishlist = catchAsync(async (req: Request, res: Response) => {
    // Pegar o userId de qndo o usuario fizer login (JWT middleware)
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError("Não autenticado.", 401);
    }

    const items = await WishlistService.getWishlist(userId);
    res.status(200).json({ data: items });
    return;
  });

  static toggleFavorite = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const { productId } = req.params;

    if (!userId) {
      throw new AppError("Não autenticado.", 401);
    }

    if (!productId) {
      throw new AppError("O ID do produto é obrigatório.", 400);
    }

    const result = await WishlistService.toggleFavorite(userId, productId);
    res.status(200).json(result);
    return;
  });

  static checkIsFavorite = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const { productId } = req.params;

    if (!userId) {
      res.status(200).json({ favorited: false });
      return;
    }

    const isFav = await WishlistService.isFavorite(userId, productId);
    res.status(200).json({ favorited: isFav });
    return;
  });
}
