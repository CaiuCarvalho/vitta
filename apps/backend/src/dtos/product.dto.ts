export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  categoryId?: string;
}
