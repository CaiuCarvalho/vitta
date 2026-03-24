import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Prisma unique constraint validation
  if (err.code === "P2002") {
    err = new AppError("Duplicate field value. Please use another value.", 409);
  }

  // Generic Prisma record not found
  if (err.code === "P2025") {
    err = new AppError("Record not found", 404);
  }

  if (process.env.NODE_ENV === "development") {
    console.error("[ERROR] 💥", err);
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Prod error formatting
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      console.error("[ERROR] 💥", err);
      res.status(500).json({
        status: "error",
        message: "Something went wrong!",
      });
    }
  }
};
