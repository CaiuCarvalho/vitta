import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { prisma } from "@vitta/database";

/**
 * Middleware que exige role ADMIN.
 * Item 20: Role validada diretamente no banco — nunca confia apenas no JWT.
 * Deve ser usado APÓS authMiddleware (que já valida tokenVersion e popula req.user com role do banco).
 *
 * Nota: authMiddleware já busca o usuário no banco e define req.user.role com o valor real.
 * Este middleware serve como camada adicional de defesa explícita no nível de rota administrativa.
 */
export const adminMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    return next(new AppError("Forbidden: authentication required", 401));
  }

  // Item 20: Confirmar role no banco — dupla verificação contra escalada de privilégio
  // (authMiddleware já faz isso, mas rotas admin recebem verificação explícita adicional)
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") {
    return next(new AppError("Forbidden: admin access required", 403));
  }

  next();
};
