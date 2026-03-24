import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

export class OrderController {
  static getOrders = catchAsync(async (_req: Request, res: Response) => {
    const orders = await OrderService.getAllOrders();
    res.status(200).json({ data: orders });
  });

  static getOrderById = catchAsync(async (req: Request, res: Response) => {
    const order = await OrderService.getOrderById(req.params.id);
    if (!order) {
      throw new AppError("Order not found", 404);
    }
    res.status(200).json({ data: order });
  });

  static createOrder = catchAsync(async (req: Request, res: Response) => {
    const { userId, items } = req.body;

    if (!userId || !items) {
      throw new AppError("Missing required fields: userId and items", 400);
    }

    const order = await OrderService.createOrder({ userId, items });
    res.status(201).json({ data: order });
  });
}


