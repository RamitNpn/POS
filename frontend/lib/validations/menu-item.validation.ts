import { z } from "zod";

export const createMenuItemSchema = z.object({
  name: z.string().trim().min(2).max(200),
  description: z.string().trim().optional(),
  categoryId: z.string().min(1),
  price: z.number().min(0),
  status: z.enum(["available", "out-of-stock"]).default("available"),
  image: z.any().optional(),
});

export type TCreateMenuItemSchema = z.infer<typeof createMenuItemSchema>;

export const menuItemSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  categoryId: z.string(),
  price: z.number(),
  status: z.string(),
  image: z.string().optional(),
});

export const getAllMenuItemsSchema = z.array(menuItemSchema);

export type TGetAllMenuItemSchema = z.infer<typeof getAllMenuItemsSchema>;

export const getMenuItemByIdSchema = menuItemSchema;

export type TGetMenuItemByIdSchema = z.infer<typeof getMenuItemByIdSchema>;

export const updateMenuItemSchema = z.object({
  name: z.string().trim().min(2).max(200).optional(),
  description: z.string().trim().optional(),
  price: z.number().min(0).optional(),
  status: z.enum(["available", "out-of-stock"]).optional(),
  image: z.any().optional(),
});

export type TUpdateMenuItemSchema = z.infer<typeof updateMenuItemSchema>;

export const deleteMenuItemSchema = z.object({
  _id: z.string(),
});

export type TDeleteMenuItemSchema = z.infer<typeof deleteMenuItemSchema>;
