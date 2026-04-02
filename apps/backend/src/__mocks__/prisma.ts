import { vi } from 'vitest';

export const prismaMock = {
  order: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
    aggregate: vi.fn(),
  },
  product: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  user: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    count: vi.fn(),
  },
  $transaction: vi.fn((items) => Promise.all(items)),
};

vi.mock('@vitta/database', () => ({
  prisma: prismaMock,
  OrderStatus: {
    PENDING: 'PENDING',
    PAID: 'PAID',
    FAILED: 'FAILED',
    SHIPPED: 'SHIPPED',
    CANCELED: 'CANCELED',
  },
}));
