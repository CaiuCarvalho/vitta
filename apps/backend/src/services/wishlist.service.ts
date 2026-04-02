import { prisma } from "@vitta/database";
import { AppError } from "../utils/AppError";

export class WishlistService {
  private static MAX_ITEMS = 20;

  /**
   * Retorna todos os itens da lista de desejos de um usuário.
   */
  static async getWishlist(userId: string) {
    const items = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return items;
  }

  /**
   * Adiciona ou remove um produto dos favoritos.
   * Implementa limite de 20 itens e previne duplicatas.
   */
  static async toggleFavorite(userId: string, productId: string) {
    // 1. Verifica se já existe
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      // Remove se já existe (Desfavoritar)
      await prisma.wishlistItem.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });
      return { favorited: false };
    }

    // 2. Se for adicionar, verifica se atingiu o limite de 20
    const count = await prisma.wishlistItem.count({
      where: { userId },
    });

    if (count >= this.MAX_ITEMS) {
      throw new AppError(`Você atingiu o limite de ${this.MAX_ITEMS} favoritos. Remova algum para adicionar este.`, 400);
    }

    // 3. Adiciona (Favoritar)
    await prisma.wishlistItem.create({
      data: {
        userId,
        productId,
      },
    });

    return { favorited: true };
  }

  /**
   * Verifica se um produto específico está nos favoritos de um usuário.
   */
  static async isFavorite(userId: string, productId: string) {
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return !!existing;
  }
}
