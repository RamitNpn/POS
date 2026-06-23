"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsContract = void 0;
const core_1 = require("@ts-rest/core");
const stats_schema_1 = require("./stats.schema");
const commonSchema_1 = require("../commonSchema");
const zod_1 = require("zod");
const c = (0, core_1.initContract)();
exports.statsContract = c.router({
    getDashboardStats: {
        method: "GET",
        path: "/stats/dashboard",
        summary: "Get overall dashboard statistics",
        responses: {
            200: zod_1.z.object({
                data: stats_schema_1.dashboardStatsSchema,
            }),
            500: commonSchema_1.errorSchema,
        },
    },
    getTableStats: {
        method: "GET",
        path: "/stats/table",
        summary: "Get table occupancy and usage statistics",
        responses: {
            200: zod_1.z.object({
                data: stats_schema_1.tableStatsSchema,
            }),
            500: commonSchema_1.errorSchema,
        },
    },
    getRevenueChart: {
        method: "GET",
        path: "/stats/revenue-chart",
        summary: "Get revenue chart data for analytics",
        query: zod_1.z.object({
            period: zod_1.z.enum(["7d", "30d", "90d", "1y", "all"]).default("30d"),
        }),
        responses: {
            200: stats_schema_1.revenueChartSchema,
        },
    },
    getRevenueStats: {
        method: "GET",
        path: "/stats/revenue",
        summary: "Get revenue, orders and reservation statistics",
        responses: {
            200: zod_1.z.object({
                data: stats_schema_1.revenueStatsSchema,
            }),
            500: commonSchema_1.errorSchema,
        },
    },
    getProfitLossStats: {
        method: "GET",
        path: "/stats/profit-loss",
        summary: "Get profit vs loss statistics",
        query: zod_1.z.object({
            period: zod_1.z.enum(["today", "7d", "30d", "90d", "1y", "all"]).default("30d"),
        }),
        responses: {
            200: zod_1.z.object({
                data: zod_1.z.object({
                    totalRevenue: zod_1.z.number(),
                    totalExpenses: zod_1.z.number(),
                    profit: zod_1.z.number(),
                    loss: zod_1.z.number(),
                    netProfit: zod_1.z.number(),
                    ordersCount: zod_1.z.number(),
                    expensesCount: zod_1.z.number(),
                    revenueSeries: zod_1.z.array(zod_1.z.object({
                        date: zod_1.z.string(),
                        revenue: zod_1.z.number(),
                        expense: zod_1.z.number(),
                        profit: zod_1.z.number(),
                    })),
                }),
            }),
            500: commonSchema_1.errorSchema,
        },
    },
    cashierCheckoutStats: {
        method: "GET",
        path: "/stats/cashier-checkout",
        summary: "Get Cashier Page Stats",
        responses: {
            200: zod_1.z.object({
                success: zod_1.z.boolean(),
                data: zod_1.z.object({
                    totalActiveOrders: zod_1.z.number(),
                    readyForCheckout: zod_1.z.number(),
                    pendingPayments: zod_1.z.number(),
                    tablesInHouse: zod_1.z.number(),
                }),
            }),
        },
    },
});
