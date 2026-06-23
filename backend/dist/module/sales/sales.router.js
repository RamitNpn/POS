"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesRouter = void 0;
const express_1 = require("@ts-rest/express");
const sales_contract_1 = require("../../contract/sales/sales.contract");
const sales_query_1 = require("./sales.query");
const s = (0, express_1.initServer)();
exports.salesRouter = s.router(sales_contract_1.salesContract, {
    getSalesAnalytics: sales_query_1.salesQueryHandler.getSalesAnalytics,
    getTopSellingItems: sales_query_1.salesQueryHandler.getTopSellingItems,
});
