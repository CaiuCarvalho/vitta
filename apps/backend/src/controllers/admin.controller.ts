import { Request, Response, NextFunction } from "express";
import { AdminService } from "../services/admin.service";
import logger from "../utils/logger";

export class AdminController {
  /**
   * Responde com as estatísticas do painel administrativo.
   */
  static async getStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getDashboardStats();
      res.status(200).json({ success: true, data: stats });
    } catch (err) {
      logger.error(`[AdminController] Error fetching stats: ${err}`);
      next(err);
    }
  }

  /**
   * Responde com a listagem completa de pedidos para o Admin.
   */
  static async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await AdminService.getAdminOrders(page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      logger.error(`[AdminController] Error fetching orders: ${err}`);
      next(err);
    }
  }
}
