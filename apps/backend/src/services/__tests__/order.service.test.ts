import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderService } from '../order.service';
import { prismaMock } from '../../tests/setup';

// Mocks de outros serviços
vi.mock('../email.service', () => ({
  EmailService: {
    sendTrackingCodeEmail: vi.fn(),
  },
}));

describe('OrderService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should throw an error if no items are provided', async () => {
      await expect(OrderService.createOrder({ userId: 'u1', items: [] }))
        .rejects.toThrow('Order must have at least one item.');
    });

    it('should throw an error if a product does not have enough stock', async () => {
      const mockProduct = { id: 'p1', name: 'Jersey', price: 100, stock: 2 };
      
      // Mock findMany de produtos
      prismaMock.product.findMany.mockResolvedValue([mockProduct]);

      const cartItems = [{ productId: 'p1', quantity: 5, unitPrice: 100 }];

      await expect(OrderService.createOrder({ userId: 'u1', items: cartItems as any }))
        .rejects.toThrow(/Jersey.*tem apenas 2 unidades/);
    });

    it('should create an order successfully when stock is available', async () => {
      const mockProduct = { id: 'p1', name: 'Jersey', price: 200, stock: 10 };
      prismaMock.product.findMany.mockResolvedValue([mockProduct]);
      
      prismaMock.order.create.mockResolvedValue({
        id: 'o1',
        userId: 'u1',
        total: 200,
        status: 'PENDING',
        items: [{ productId: 'p1', quantity: 1, unitPrice: 200 }]
      });

      const cartItems = [{ productId: 'p1', quantity: 1, unitPrice: 200 }];
      const order = await OrderService.createOrder({ userId: 'u1', items: cartItems as any });

      expect(order).toBeDefined();
      expect(prismaMock.order.create).toHaveBeenCalled();
    });
  });

  describe('decrementStock', () => {
    it('should call prisma transaction with correct decrement data', async () => {
      const mockOrder = {
        id: 'o1',
        items: [
          { productId: 'p1', quantity: 2 },
          { productId: 'p2', quantity: 1 }
        ]
      };

      prismaMock.order.findUnique.mockResolvedValue(mockOrder);

      await OrderService.decrementStock('o1');

      expect(prismaMock.$transaction).toHaveBeenCalled();
      expect(prismaMock.product.update).toHaveBeenCalledTimes(2);
    });
  });
});
