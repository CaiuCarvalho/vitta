import { prisma } from "@vitta/database";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../dtos/category.dto";

export class CategoryService {
  static async getAllCategories() {
    return prisma.category.findMany({
      include: { products: true },
      orderBy: { name: "asc" },
    });
  }

  static async getCategoryById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
  }

  static async getCategoryBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: { products: true },
    });
  }

  static async createCategory(data: CreateCategoryDTO) {
    return prisma.category.create({ data });
  }

  static async updateCategory(id: string, data: UpdateCategoryDTO) {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  static async deleteCategory(id: string) {
    return prisma.category.delete({ where: { id } });
  }
}
