import { prisma } from "@vitta/database";
import { OrderStatus } from "@vitta/database";

export interface DashboardStats {
  totalRevenue: number;
  ordersPaidCount: number;
  usersTotalCount: number;
  outOfStockProductsCount: number;
  lowStockProductsCount: number;
}

export class AdminService {
  /**
   * Agrega estatísticas críticas para o painel administrativo.
   */
  static async getDashboardStats(): Promise<DashboardStats> {
    const [revenueResult, ordersPaidCount, usersTotalCount, outOfStockProductsCount, lowStockProductsCount] = await Promise.all([
      // 1. Receita Total (Soma de pedidos PAID)
      prisma.order.aggregate({
        where: { status: OrderStatus.PAID },
        _sum: { total: true }
      }),
      // 2. Pedidos Concluídos
      prisma.order.count({
        where: { status: OrderStatus.PAID }
      }),
      // 3. Total de Clientes
      prisma.user.count(),
      // 4. Produtos Sem Estoque
      prisma.product.count({
        where: { stock: 0 }
      }),
      // 5. Alerta de Estoque Baixo (< 10 unidades)
      prisma.product.count({
        where: { 
          stock: { 
            gt: 0,
            lt: 10 
          } 
        }
      })
    ]);

    return {
      totalRevenue: revenueResult._sum.total || 0,
      ordersPaidCount,
      usersTotalCount,
      outOfStockProductsCount,
      lowStockProductsCount
    };
  }

  /**
   * Listagem de pedidos com paginação e dados do usuário para o Admin.
   */
  static async getAdminOrders(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: true } }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.order.count()
    ]);

    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
