import { z } from "zod";

export const salesCategorySchema = z.object({
  category: z.string(),
  sales: z.number(),
  percentage: z.number(),
});

export const salesAnalyticsSchema = z.object({
  totalRevenue: z.number(),
  totalCategories: z.number(),
  topCategory: z.string().nullable(),
  salesByCategory: z.array(salesCategorySchema),
});

export const getSalesAnalyticsQuerySchema = z.object({
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});

export const salesItemSchema = z.object({
  menuItemId: z.string(),
  name: z.string(),
  quantity: z.number(),
  revenue: z.number(),
});

export const getTopSellingItemsSchema = z.object({
  topItem: z.string(),
  topRevenue: z.number(),
  totalItems: z.number(),
  items: z.array(salesItemSchema),
});