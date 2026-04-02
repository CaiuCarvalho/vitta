import { Request, Response } from "express";
import { ProductService, ProductFilters } from "../services/product.service";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

const MAX_PAGE_LIMIT = 100;

export class ProductController {
  /**
   * Public: Get a paginated list of all products with optional filters
   */
  static getProducts = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const page = Math.max(1, parseInt(req.query.page as string || "1"));
    const limit = Math.min(MAX_PAGE_LIMIT, Math.max(1, parseInt(req.query.limit as string || "20")));
    
    // Type-safe filters from query params
    const filters: ProductFilters = {
      search: req.query.search as string,
      categoryId: (req.query.category || req.query.categoryId) as string,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      sort: req.query.sort as string,
    };

    const result = await ProductService.getAllProducts(page, limit, filters);
    res.status(200).json(result);
  });

  /**
   * Public: Get details of a specific product
   */
  static getProductById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const product = await ProductService.getProductById(req.params.id);
    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }
    res.status(200).json(product);
  });

  /**
   * ADMIN only: Create a new product
   */
  static createProduct = catchAsync(async (req: Request, res: Response): Promise<void> => {
    // Validado pelo Zod middleware, mas mantendo redundância de segurança
    const product = await ProductService.createProduct(req.body);
    res.status(201).json(product);
  });

  /**
   * ADMIN only: Update existing product details
   */
  static updateProduct = catchAsync(async (req: Request, res: Response): Promise<void> => {
    // Whitelist allowed fields is handled by the service or middleware validation
    const product = await ProductService.updateProduct(req.params.id, req.body);
    res.status(200).json(product);
  });

  /**
   * ADMIN only: Delete a product
   */
  static deleteProduct = catchAsync(async (req: Request, res: Response): Promise<void> => {
    await ProductService.deleteProduct(req.params.id);
    res.status(204).send();
  });
}
