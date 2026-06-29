import { z } from "zod";

export const dailyReportSchema = z.object({
  id: z.string(),
  reportDate: z.string(),
  totalRevenue: z.number(),
  totalOrders: z.number(),
  totalExpense: z.number(),
  cashSales: z.number(),
  onlineSales: z.number(),
  totalDiscount: z.number(),
  totalTax: z.number(),
  generatedAt: z.string(),
});

export const dailyReportsResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(dailyReportSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export const generateReportResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});