"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopSellingItemsSchema = exports.salesItemSchema = exports.getSalesAnalyticsQuerySchema = exports.salesAnalyticsSchema = exports.salesCategorySchema = void 0;
const zod_1 = require("zod");
exports.salesCategorySchema = zod_1.z.object({
    category: zod_1.z.string(),
    sales: zod_1.z.number(),
    percentage: zod_1.z.number(),
});
exports.salesAnalyticsSchema = zod_1.z.object({
    totalRevenue: zod_1.z.number(),
    totalCategories: zod_1.z.number(),
    topCategory: zod_1.z.string().nullable(),
    salesByCategory: zod_1.z.array(exports.salesCategorySchema),
});
exports.getSalesAnalyticsQuerySchema = zod_1.z.object({
    fromDate: zod_1.z.string().optional(),
    toDate: zod_1.z.string().optional(),
});
exports.salesItemSchema = zod_1.z.object({
    menuItemId: zod_1.z.string(),
    name: zod_1.z.string(),
    quantity: zod_1.z.number(),
    revenue: zod_1.z.number(),
});
exports.getTopSellingItemsSchema = zod_1.z.object({
    topItem: zod_1.z.string(),
    topRevenue: zod_1.z.number(),
    totalItems: zod_1.z.number(),
    items: zod_1.z.array(exports.salesItemSchema),
});
