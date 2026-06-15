import { z } from "zod";

export const createMenuCategorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().optional(),
});

export type TCreateMenuCategorySchema = z.infer<typeof createMenuCategorySchema>;

export const menuCategorySchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  itemCount: z.number().optional(),
});

export const getAllMenuCategoriesSchema = z.array(menuCategorySchema);

export type TGetAllMenuCategorySchema = z.infer<typeof getAllMenuCategoriesSchema>;

export const getMenuCategoryByIdSchema = menuCategorySchema;

export type TGetMenuCategoryByIdSchema = z.infer<typeof getMenuCategoryByIdSchema>;

export const updateMenuCategorySchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  description: z.string().trim().optional(),
});

export type TUpdateMenuCategorySchema = z.infer<typeof updateMenuCategorySchema>;

export const deleteMenuCategorySchema = z.object({
  _id: z.string(),
});

export type TDeleteMenuCategorySchema = z.infer<typeof deleteMenuCategorySchema>;
