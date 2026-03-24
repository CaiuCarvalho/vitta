export interface CreateOrderDTO {
  userId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}
