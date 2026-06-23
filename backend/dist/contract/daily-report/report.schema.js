"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReportResponseSchema = exports.dailyReportsResponseSchema = exports.dailyReportSchema = void 0;
const zod_1 = require("zod");
exports.dailyReportSchema = zod_1.z.object({
    id: zod_1.z.string(),
    reportDate: zod_1.z.string(),
    totalRevenue: zod_1.z.number(),
    totalOrders: zod_1.z.number(),
    cashSales: zod_1.z.number(),
    onlineSales: zod_1.z.number(),
    totalDiscount: zod_1.z.number(),
    totalTax: zod_1.z.number(),
    generatedAt: zod_1.z.string(),
});
exports.dailyReportsResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    data: zod_1.z.array(exports.dailyReportSchema),
    pagination: zod_1.z.object({
        page: zod_1.z.number(),
        limit: zod_1.z.number(),
        total: zod_1.z.number(),
        totalPages: zod_1.z.number(),
    }),
});
exports.generateReportResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string(),
});
