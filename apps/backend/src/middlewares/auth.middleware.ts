import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("FATAL: JWT_SECRET environment variable is not set. Server cannot start.");
  }
  return secret;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Not authorized, no token provided", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret) as {
      userId: string;
      role: string;
    };
    req.user = { userId: decoded.userId, role: decoded.role || "USER" };
    next();
  } catch (error) {
    return next(new AppError("Not authorized, token failed", 401));
  }
};
