import { z } from "zod";

export const createMenuCategorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().optional(),
  itemCount: z.number().optional(),
});

export const menuCategorySchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  itemCount: z.number().optional(),
});

export const getMenuCategoryByIdSchema = menuCategorySchema;

export const getAllMenuCategoriesSchema = z.array(menuCategorySchema);

export const updateMenuCategorySchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  description: z.string().optional(),
  itemCount: z.number().optional(),
});
