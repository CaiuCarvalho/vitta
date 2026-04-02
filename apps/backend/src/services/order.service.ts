import { prisma, OrderStatus } from "@vitta/database";
import { CartItem, OrderDTO } from "@vitta/utils";
import { EmailService } from "./email.service";
import { OrderMapper } from "../dtos/order.mapper";
import { AppError } from "../utils/AppError";

export interface PaginatedOrders {
  orders: OrderDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class OrderService {
  static async getAllOrders(page: number = 1, limit: number = 20): Promise<PaginatedOrders> {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        include: {
          items: { include: { product: true } },
          user: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count(),
    ]);
    
    return { 
      orders: OrderMapper.toPublicDTOList(orders), 
      total, 
      page, 
      limit, 
      totalPages: Math.ceil(total / limit) 
    };
  }

  static async getMyOrders(userId: string): Promise<OrderDTO[]> {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return OrderMapper.toPublicDTOList(orders);
  }

  static async getOrderById(id: string): Promise<OrderDTO | null> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        user: true,
      },
    });
    return order ? OrderMapper.toPublicDTO(order) : null;
  }

  static async createOrder(data: { userId: string, items: CartItem[], shippingCost?: number }): Promise<OrderDTO> {
    if (!data.items || data.items.length === 0) {
      throw new AppError("O pedido deve ter pelo menos um item.", 400);
    }

    const shipping = data.shippingCost || 0;

    const aggregatedItems = data.items.reduce((acc, current) => {
      if (acc[current.productId]) {
        acc[current.productId].quantity += current.quantity;
      } else {
        acc[current.productId] = { ...current };
      }
      return acc;
    }, {} as Record<string, CartItem>);

    const mergedItems = Object.values(aggregatedItems);
    const productIds = Object.keys(aggregatedItems);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new AppError("Um ou mais produtos não foram encontrados.", 404);
    }

    let itemsTotal = 0;
    const orderItemsRecord: { productId: string; quantity: number; unitPrice: number }[] = [];

    for (const item of mergedItems) {
      const product = products.find((p) => p.id === item.productId)!;
      
      if (product.stock < item.quantity) {
        throw new AppError(`O produto "${product.name}" tem apenas ${product.stock} unidades em estoque.`, 400);
      }

      itemsTotal += product.price * item.quantity;
      orderItemsRecord.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
      });
    }

    const finalTotal = itemsTotal + shipping;

    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        total: finalTotal,
        status: OrderStatus.PENDING,
        items: {
          create: orderItemsRecord,
        },
      },
      include: {
        items: { include: { product: true } },
        user: true,
      },
    });

    return OrderMapper.toPublicDTO(order);
  }

  static async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    abacateBillingId?: string
  ): Promise<OrderDTO> {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        ...(abacateBillingId ? { abacateBillingId } : {}),
      },
      include: {
        items: { include: { product: true } },
        user: true,
      },
    });
    return OrderMapper.toPublicDTO(order);
  }

  static async findByAbacateBillingId(abacateBillingId: string): Promise<OrderDTO | null> {
    const order = await prisma.order.findFirst({
      where: { abacateBillingId },
      include: {
        user: true,
        items: { include: { product: true } },
      },
    });
    return order ? OrderMapper.toPublicDTO(order) : null;
  }

  static async updateTrackingCode(orderId: string, trackingCode: string): Promise<OrderDTO> {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        trackingCode,
        shippedAt: new Date(),
        status: OrderStatus.SHIPPED,
      },
      include: {
        user: true,
        items: { include: { product: true } },
      },
    });

    try {
      if (order.user) {
        await EmailService.sendTrackingCodeEmail(
          order.user.email,
          order.user.name,
          order.id,
          trackingCode
        );
      }
    } catch (err) {
      console.warn(`[OrderService] Falha ao enviar email de rastreio para ${order.user?.email}`);
    }

    return OrderMapper.toPublicDTO(order);
  }

  static async decrementStock(orderId: string): Promise<void> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) return;

    await prisma.$transaction(
      order.items.map(item => 
        prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        })
      )
    );
  }
}
