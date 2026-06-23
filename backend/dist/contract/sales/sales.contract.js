"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesContract = void 0;
const core_1 = require("@ts-rest/core");
const sales_schema_1 = require("./sales.schema");
const commonSchema_1 = require("../commonSchema");
const c = (0, core_1.initContract)();
exports.salesContract = c.router({
    getSalesAnalytics: {
        method: "GET",
        path: "/sales",
        summary: "Get sales analytics grouped by menu category",
        query: sales_schema_1.getSalesAnalyticsQuerySchema,
        responses: {
            200: sales_schema_1.salesAnalyticsSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    getTopSellingItems: {
        method: "GET",
        path: "/sales/items",
        summary: "Get top selling menu items",
        responses: {
            200: sales_schema_1.getTopSellingItemsSchema,
            500: commonSchema_1.errorSchema,
        },
    },
});
