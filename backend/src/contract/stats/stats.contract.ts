import { initContract } from "@ts-rest/core";
import {
  dashboardStatsSchema,
  revenueChartSchema,
  revenueStatsSchema,
  tableStatsSchema,
} from "./stats.schema";
import { errorSchema } from "../commonSchema";
import { z } from "zod";

const c = initContract();

export const statsContract = c.router({
  getDashboardStats: {
    method: "GET",
    path: "/stats/dashboard",
    summary: "Get overall dashboard statistics",
    responses: {
      200: z.object({
        data: dashboardStatsSchema,
      }),
      500: errorSchema,
    },
  },

  getTableStats: {
    method: "GET",
    path: "/stats/table",
    summary: "Get table occupancy and usage statistics",
    responses: {
      200: z.object({
        data: tableStatsSchema,
      }),
      500: errorSchema,
    },
  },

  getRevenueChart: {
    method: "GET",
    path: "/stats/revenue-chart",
    summary: "Get revenue chart data for analytics",
    query: z.object({
      period: z.enum(["7d", "30d", "90d", "1y", "all"]).default("30d"),
    }),
    responses: {
      200: revenueChartSchema,
    },
  },

  getRevenueStats: {
    method: "GET",
    path: "/stats/revenue",
    summary: "Get revenue, orders and reservation statistics",
    responses: {
      200: z.object({
        data: revenueStatsSchema,
      }),
      500: errorSchema,
    },
  },

  getProfitLossStats: {
    method: "GET",
    path: "/stats/profit-loss",
    summary: "Get profit vs loss statistics",
    query: z.object({
      period: z.enum(["today", "7d", "30d", "90d", "1y", "all"]).default("30d"),
    }),
    responses: {
      200: z.object({
        data: z.object({
          totalRevenue: z.number(),
          totalExpenses: z.number(),
          profit: z.number(),
          loss: z.number(),
          netProfit: z.number(),

          ordersCount: z.number(),
          expensesCount: z.number(),

          revenueSeries: z.array(
            z.object({
              date: z.string(),
              revenue: z.number(),
              expense: z.number(),
              profit: z.number(),
            }),
          ),
        }),
      }),
      500: errorSchema,
    },
  },
  cashierCheckoutStats: {
    method: "GET",
    path: "/stats/cashier-checkout",
    summary: "Get Cashier Page Stats",
    responses: {
      200: z.object({
        success: z.boolean(),
        data: z.object({
          totalActiveOrders: z.number(),
          readyForCheckout: z.number(),
          pendingPayments: z.number(),
          tablesInHouse: z.number(),
        }),
      }),
    },
  },
});
