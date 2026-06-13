import { z } from "zod";

export const inventoryUnitEnum = z.enum([
  "kg",
  "gram",
  "liter",
  "ml",
  "pcs",
  "pack",
  "box",
  "bottle",
  "can",
  "tray",
  "dozen",
]);

export const createInventorySchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(2).max(100),
  unit: inventoryUnitEnum,
  currentStock: z.number().optional(),
  minimumStock: z.number().optional(),
  reorderLevel: z.number().optional(),
  costPerUnit: z.number(),
  supplierId: z.string().optional(),
  expiryDate: z.coerce.date().optional(),
  lastRestocked: z.coerce.date().optional(),
  category: z.string().min(1),
});

export const inventorySchema = z.object({
  _id: z.string(),
  sku: z.string(),
  name: z.string(),
  unit: z.string(),
  currentStock: z.number(),
  minimumStock: z.number(),
  reorderLevel: z.number(),
  costPerUnit: z.number(),
  supplierId: z.string().optional(),
  expiryDate: z.coerce.date().optional(),
  lastRestocked: z.coerce.date().optional(),
  category: z.string(),
});

export const getInventoryByIdSchema = inventorySchema;

export const getAllInventorySchema = z.array(inventorySchema);

export const updateInventorySchema = z.object({
  sku: z.string().optional(),
  name: z.string().min(2).max(100).optional(),
  unit: inventoryUnitEnum.optional(),
  currentStock: z.number().optional(),
  minimumStock: z.number().optional(),
  reorderLevel: z.number().optional(),
  costPerUnit: z.number().optional(),
  supplierId: z.string().optional(),
  expiryDate: z.coerce.date().optional(),
  lastRestocked: z.coerce.date().optional(),
  category: z.string().optional(),
});
