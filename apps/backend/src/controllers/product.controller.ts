import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

export class ProductController {
  static getProducts = catchAsync(async (_req: Request, res: Response) => {
    const products = await ProductService.getAllProducts();
    res.status(200).json({ data: products });
  });

  static getProductById = catchAsync(async (req: Request, res: Response) => {
    const product = await ProductService.getProductById(req.params.id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    res.status(200).json({ data: product });
  });

  static createProduct = catchAsync(async (req: Request, res: Response) => {
    const { name, description, price, imageUrl, categoryId } = req.body;
    if (!name || !description || price == null || !categoryId) {
      throw new AppError("Missing required fields: name, description, price, categoryId", 400);
    }
    const product = await ProductService.createProduct({ name, description, price, imageUrl, categoryId });
    res.status(201).json({ data: product });
  });

  static updateProduct = catchAsync(async (req: Request, res: Response) => {
    const product = await ProductService.updateProduct(req.params.id, req.body);
    res.status(200).json({ data: product });
  });

  static deleteProduct = catchAsync(async (req: Request, res: Response) => {
    await ProductService.deleteProduct(req.params.id);
    res.status(204).send();
  });
}


