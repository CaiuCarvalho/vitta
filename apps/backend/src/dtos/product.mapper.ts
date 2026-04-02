import { Product, Category } from "@vitta/database";
import { ProductDTO, CategoryDTO } from "@vitta/utils";

export class ProductMapper {
  static toDTO(product: Product & { category?: Category | null }): ProductDTO {
    if (!product) return null as any;

    const dto: ProductDTO = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      categoryId: product.categoryId,
    };

    if (product.category) {
      dto.category = {
        id: product.category.id,
        slug: product.category.slug,
        name: product.category.name,
        description: product.category.description,
      };
    }

    return dto;
  }

  static toDTOList(products: (Product & { category?: Category | null })[]): ProductDTO[] {
    return products.map((p) => this.toDTO(p));
  }
}
