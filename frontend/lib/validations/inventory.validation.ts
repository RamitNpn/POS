import { z } from "zod";

export const createInventorySchema = z.object({
  name: z.string().trim().min(2).max(200),
  category: z.string().trim().min(1).max(100),
  unit: z.string().trim().min(1).max(50),
  currentStock: z.number().min(0),
  reorderLevel: z.number().min(0),
  minimumStock: z.number().min(0),
  supplierId: z.string().optional(),
});

export type TCreateInventorySchema = z.infer<typeof createInventorySchema>;

export const inventorySchema = z.object({
  _id: z.string(),
  name: z.string(),
  category: z.string(),
  unit: z.string(),
  currentStock: z.number(),
  reorderLevel: z.number(),
  minimumStock: z.number(),
  supplierId: z.string().optional(),
});

export const getAllInventorySchema = z.array(inventorySchema);

export type TGetAllInventorySchema = z.infer<typeof getAllInventorySchema>;

export const getInventoryByIdSchema = inventorySchema;

export type TGetInventoryByIdSchema = z.infer<typeof getInventoryByIdSchema>;

export const updateInventorySchema = z.object({
  name: z.string().trim().min(2).max(200).optional(),
  category: z.string().trim().min(1).max(100).optional(),
  unit: z.string().trim().min(1).max(50).optional(),
  currentStock: z.number().min(0).optional(),
  reorderLevel: z.number().min(0).optional(),
  minimumStock: z.number().min(0).optional(),
  supplierId: z.string().optional(),
});

export type TUpdateInventorySchema = z.infer<typeof updateInventorySchema>;

export const deleteInventorySchema = z.object({
  _id: z.string(),
});

export type TDeleteInventorySchema = z.infer<typeof deleteInventorySchema>;
