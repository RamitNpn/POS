import { z } from "zod";

export const createMenuSubCategorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().optional(),
  categoryId: z.string().min(1),
  isActive: z.boolean().default(true),
});

export type TCreateMenuSubCategorySchema = z.infer<typeof createMenuSubCategorySchema>;

export const menuSubCategorySchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  categoryId: z.string(),
  isActive: z.boolean(),
});

export const getAllMenuSubCategoriesSchema = z.array(menuSubCategorySchema);

export type TGetAllMenuSubCategorySchema = z.infer<typeof getAllMenuSubCategoriesSchema>;

export const getMenuSubCategoryByIdSchema = menuSubCategorySchema;

export type TGetMenuSubCategoryByIdSchema = z.infer<typeof getMenuSubCategoryByIdSchema>;

export const updateMenuSubCategorySchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  description: z.string().trim().optional(),
  categoryId: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

export type TUpdateMenuSubCategorySchema = z.infer<typeof updateMenuSubCategorySchema>;

export const deleteMenuSubCategorySchema = z.object({
  _id: z.string(),
});

export type TDeleteMenuSubCategorySchema = z.infer<typeof deleteMenuSubCategorySchema>;
