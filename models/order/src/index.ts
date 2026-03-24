// Model: Order

export type OrderStatus = "pending" | "processing" | "paid" | "shipped" | "delivered" | "cancelled";

export interface OrderProduct {
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  user_id: string;
  products: OrderProduct[];
  total: number;
  status: OrderStatus;
  created_at: Date;
  updated_at: Date;
}
