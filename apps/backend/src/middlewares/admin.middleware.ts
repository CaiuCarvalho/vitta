import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

/**
 * Middleware that requires the authenticated user to have ADMIN role.
 * Must be used AFTER authMiddleware.
 */
export const adminMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return next(new AppError("Forbidden: admin access required", 403));
  }
  next();
};
