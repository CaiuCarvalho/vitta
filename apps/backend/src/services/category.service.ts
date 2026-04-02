import { prisma } from "@vitta/database";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../dtos/category.dto";

export class CategoryService {
  static async getAllCategories(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { name: "asc" },
        skip,
        take: limit,
      }),
      prisma.category.count(),
    ]);
    return { categories, total, page, limit, totalPages: Math.ceil(total / limit) };
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
