import { z } from "zod";

export const menuItemStatusEnum = z.enum([
  "available",
  "out-of-stock",
  "hidden",
]);

export const variantTypeEnum = z.enum([
  "ml",
  "veg",
  "non-veg",
  "chili",
  "fry",
  "boil",
]);

export const createMenuItemSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(5),
  price: z.number(),
  categoryId: z.string(),
  subCategoryId: z.string(),
  image: z.string().url().optional(),
  status: menuItemStatusEnum.optional(),
  costPrice: z.number().optional(),
  variantType: variantTypeEnum.optional(),
  variantValue: z.string().optional(),
});

export const menuItemSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  categoryId: z.string(),
  subCategoryId: z.string(),
  image: z.string().optional(),
  status: menuItemStatusEnum,
  costPrice: z.number().optional(),
  // EXTRA
  variantType: variantTypeEnum.optional(),
  variantValue: z.string().optional(),
});

export const getAllMenuItemsSchema = z.array(menuItemSchema);

export const getMenuItemByIdSchema = menuItemSchema;

export const updateMenuItemSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  categoryId: z.string().optional(),
    subCategoryId: z.string().optional(),
  image: z.string().url().optional(),
  status: menuItemStatusEnum.optional(),
  costPrice: z.number().optional(),
  // EXTRA
  variantType: variantTypeEnum.optional(),
  variantValue: z.string().optional(),
});
