import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

export class CategoryController {
  static getCategories = catchAsync(async (_req: Request, res: Response) => {
    const categories = await CategoryService.getAllCategories();
    res.status(200).json({ data: categories });
  });

  static getCategoryById = catchAsync(async (req: Request, res: Response) => {
    const category = await CategoryService.getCategoryById(req.params.id);
    if (!category) {
      throw new AppError("Category not found", 404);
    }
    res.status(200).json({ data: category });
  });

  static getCategoryBySlug = catchAsync(async (req: Request, res: Response) => {
    const category = await CategoryService.getCategoryBySlug(req.params.slug);
    if (!category) {
      throw new AppError("Category not found", 404);
    }
    res.status(200).json({ data: category });
  });

  static createCategory = catchAsync(async (req: Request, res: Response) => {
    const { name, slug, description } = req.body;
    if (!name || !slug) {
      throw new AppError("Missing required fields: name and slug", 400);
    }
    const category = await CategoryService.createCategory({ name, slug, description });
    res.status(201).json({ data: category });
  });

  static updateCategory = catchAsync(async (req: Request, res: Response) => {
    const category = await CategoryService.updateCategory(req.params.id, req.body);
    res.status(200).json({ data: category });
  });

  static deleteCategory = catchAsync(async (req: Request, res: Response) => {
    await CategoryService.deleteCategory(req.params.id);
    res.status(204).send();
  });
}

