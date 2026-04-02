import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().int().nonnegative("Price must be a non-negative number"),
    stock: z.number().int().nonnegative("Stock must be a non-negative integer"),
    categoryId: z.string().min(1, "CategoryId is required"),
    imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    price: z.number().nonnegative().optional(),
    stock: z.number().int().nonnegative().optional(),
    categoryId: z.string().min(1).optional(),
    imageUrl: z.string().url().optional().or(z.literal("")),
  }),
});
