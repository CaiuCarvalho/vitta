import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import { OrderStatus } from "@vitta/database";

interface AuthenticatedRequest extends Request {
  auth: {
    userId: string;
    role: string;
  };
}

export class OrderController {
  /**
   * ADMIN only: Get a paginated list of all orders
   */
  static getAllOrders = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string || "1");
    const limit = parseInt(req.query.limit as string || "20");

    const result = await OrderService.getAllOrders(page, limit);
    res.status(200).json(result);
  });

  /**
   * Self: Get all orders of the authenticated user
   */
  static getMyOrders = catchAsync(async (req: any, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const orders = await OrderService.getMyOrders(authReq.auth.userId);
    res.status(200).json(orders);
  });

  /**
   * Mixed: Get order by ID with ownership check
   */
  static getOrderById = catchAsync(async (req: any, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const order = await OrderService.getOrderById(req.params.id);
    
    if (!order) {
      throw new AppError("Pedido não encontrado", 404);
    }

    // Ownership check — only the order owner or admin can view
    if (authReq.auth.role !== "ADMIN" && order.userId !== authReq.auth.userId) {
      throw new AppError("Acesso negado: você não tem permissão para ver este pedido", 403);
    }

    res.status(200).json(order);
  });

  /**
   * Self: Create a new order (Checkout completion)
   */
  static createOrder = catchAsync(async (req: any, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const { items, shippingCost } = req.body;

    const order = await OrderService.createOrder({ 
      userId: authReq.auth.userId, 
      items, 
      shippingCost 
    });
    
    res.status(201).json(order);
  });

  /**
   * ADMIN only: Manually update order status
   */
  static updateStatus = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { status } = req.body;
    const order = await OrderService.updateOrderStatus(req.params.id, status as OrderStatus);
    res.status(200).json(order);
  });

  /**
   * ADMIN only: Update order with tracking code and mark as shipped
   */
  static updateTracking = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { trackingCode } = req.body;
    const order = await OrderService.updateTrackingCode(req.params.id, trackingCode);
    res.status(200).json(order);
  });
}
