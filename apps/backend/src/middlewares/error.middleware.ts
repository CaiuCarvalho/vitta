import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import logger from "../utils/logger";

interface PrismaError extends Error {
  code?: string;
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

export const errorHandler = (
  err: PrismaError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let status = err.status || "error";
  let message = err.message;
  let isOperational = err.isOperational || false;

  // 1. Tratamento de Erros Prisma (Ex: Record Not Found -> 404)
  if (err.code === "P2002") {
    statusCode = 409;
    status = "fail";
    message = "Valor duplicado detectado. Por favor, use outro valor.";
    isOperational = true;
  }

  if (err.code === "P2025") {
    statusCode = 404;
    status = "fail";
    message = "O recurso solicitado não foi encontrado no banco de dados.";
    isOperational = true;
  }

  // 2. Logging Profissional (Winston)
  if (statusCode >= 500) {
    logger.error(`[Error 500] %s | Stack: %s`, err.message, err.stack);
  } else {
    logger.warn(`[Client Error ${statusCode}] %s`, err.message);
  }

  // 3. Resposta ao Cliente
  if (process.env.NODE_ENV === "development") {
    res.status(statusCode).json({
      status,
      message,
      stack: err.stack,
    });
  } else {
    // Produção: Não vazar stack traces
    if (isOperational) {
      res.status(statusCode).json({
        status,
        message,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Ocorreu um erro interno no servidor. Nossa equipe técnica já foi notificada.",
      });
    }
  }
};
