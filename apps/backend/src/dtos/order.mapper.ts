import { Order, OrderItem, User, Product } from "@vitta/database";
import { OrderDTO, OrderItemDTO } from "@vitta/utils";
import { UserMapper } from "./user.mapper";
import { ProductMapper } from "./product.mapper";

type OrderWithRelations = Order & {
  items?: (OrderItem & { product?: Product | null })[];
  user?: User | null;
};

export class OrderMapper {
  /**
   * Remove ativamente dados sensíveis que o Prisma poderia vazar acidentalmente
   * Limpa a ramificação de User nested.
   */
  static toPublicDTO(order: OrderWithRelations): OrderDTO {
    if (!order) return null as any;
    
    const dto: OrderDTO = {
      id: order.id,
      userId: order.userId,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      shippedAt: order.shippedAt,
      trackingCode: order.trackingCode,
    };

    if (order.user) {
      (dto as any).user = UserMapper.toPublicDTO(order.user);
    }

    if (order.items) {
      dto.items = order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        product: item.product ? ProductMapper.toDTO(item.product) : undefined,
      }));
    }

    return dto;
  }

  static toPublicDTOList(orders: OrderWithRelations[]): OrderDTO[] {
    return orders.map(order => this.toPublicDTO(order));
  }
}
