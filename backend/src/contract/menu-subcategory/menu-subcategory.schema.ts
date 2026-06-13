import { z } from "zod";

export const createMenuSubCategorySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  categoryId: z.string().min(1),
  categoryName: z.string().min(1),
  itemCount: z.number().optional(),
});

export const menuSubCategorySchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  categoryId: z.string(),
  categoryName: z.string(),
  itemCount: z.number().optional(),
});

export const getAllMenuSubCategoriesSchema = z.array(
  menuSubCategorySchema,
);

export const getMenuSubCategoryByIdSchema =
  menuSubCategorySchema;

export const updateMenuSubCategorySchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().optional(),
  categoryName: z.string().optional(),
  itemCount: z.number().optional(),
});