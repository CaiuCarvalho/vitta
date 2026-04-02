import { prisma, Prisma } from "@vitta/database";
import { CreateProductDTO, UpdateProductDTO } from "../dtos/product.dto";
import { ProductMapper } from "../dtos/product.mapper";
import { ProductDTO } from "@vitta/utils";

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

export interface PaginatedProducts {
  products: ProductDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ProductService {
  /**
   * Retorna todos os produtos com suporte a filtragem, busca e ordenação.
   */
  static async getAllProducts(
    page: number = 1, 
    limit: number = 20, 
    filters: ProductFilters = {}
  ): Promise<PaginatedProducts> {
    const skip = (page - 1) * limit;
    
    // 1. Construção dinâmica do filtro (where)
    const where: Prisma.ProductWhereInput = {};
    
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }

    // 2. Construção dinâmica da ordenação (orderBy)
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };

    if (filters.sort === 'price_asc') orderBy = { price: 'asc' };
    if (filters.sort === 'price_desc') orderBy = { price: 'desc' };
    if (filters.sort === 'oldest') orderBy = { createdAt: 'asc' };

    // 3. Execução das queries em paralelo
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return { 
      products: ProductMapper.toDTOList(products), 
      total, 
      page, 
      limit, 
      totalPages: Math.ceil(total / limit) 
    };
  }

  static async getProductById(id: string): Promise<ProductDTO | null> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    
    return product ? ProductMapper.toDTO(product) : null;
  }

  static async createProduct(data: CreateProductDTO): Promise<ProductDTO> {
    const product = await prisma.product.create({
      data,
      include: { category: true },
    });
    return ProductMapper.toDTO(product);
  }

  static async updateProduct(id: string, data: UpdateProductDTO): Promise<ProductDTO> {
    const product = await prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });
    return ProductMapper.toDTO(product);
  }

  static async deleteProduct(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }
}
