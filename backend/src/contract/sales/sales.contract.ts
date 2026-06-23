import { initContract } from "@ts-rest/core";

import {
  salesAnalyticsSchema,
  getSalesAnalyticsQuerySchema,
  getTopSellingItemsSchema,
} from "./sales.schema";

import { errorSchema } from "../commonSchema";

const c = initContract();

export const salesContract = c.router({
  getSalesAnalytics: {
    method: "GET",
    path: "/sales",
    summary: "Get sales analytics grouped by menu category",
    query: getSalesAnalyticsQuerySchema,
    responses: {
      200: salesAnalyticsSchema,
      500: errorSchema,
    },
  },
  getTopSellingItems: {
    method: "GET",
    path: "/sales/items",
    summary: "Get top selling menu items",
    responses: {
      200: getTopSellingItemsSchema,
      500: errorSchema,
    },
  },
});
