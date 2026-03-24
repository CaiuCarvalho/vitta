import { prisma } from "@vitta/database";
import { CreateProductDTO, UpdateProductDTO } from "../dtos/product.dto";

export class ProductService {
  static async getAllProducts() {
    return prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  static async createProduct(data: CreateProductDTO) {
    return prisma.product.create({
      data,
      include: { category: true },
    });
  }

  static async updateProduct(id: string, data: UpdateProductDTO) {
    return prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  static async deleteProduct(id: string) {
    return prisma.product.delete({ where: { id } });
  }
}

