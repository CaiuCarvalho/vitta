import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { prisma } from "@vitta/database";

// Item 11: Mesmas constantes do auth.service — issuer e audience devem ser idênticos
const JWT_ISSUER = "agon-backend";
const JWT_AUDIENCE = "agon-client";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("FATAL: JWT_SECRET environment variable is not set. Server cannot start.");
  }
  return secret;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Not authorized, no token provided", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = getJwtSecret();

    // Item 11: Verificar issuer e audience — rejeita tokens de outros sistemas
    const decoded = jwt.verify(token, secret, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    }) as {
      userId: string;
      role: string;
      tokenVersion: number;
    };

    // Item 5 + Item 20: Buscar usuário no banco para validar tokenVersion e role real
    // Isso garante que:
    //   - Tokens invalidados (após reset de senha) sejam rejeitados
    //   - A role do token bate com a role real no banco (anti-escalada de privilégio)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, tokenVersion: true },
    });

    if (!user) {
      return next(new AppError("Not authorized, user not found", 401));
    }

    // Item 5: Rejeitar token se tokenVersion não bater (indica login pós-reset de senha)
    if (decoded.tokenVersion !== user.tokenVersion) {
      return next(new AppError("Not authorized, token has been invalidated", 401));
    }

    // Item 20: Role vem do banco, não do token — previne escalada de privilégio
    req.user = { userId: user.id, role: user.role };
    next();
  } catch (error) {
    return next(new AppError("Not authorized, token failed", 401));
  }
};
