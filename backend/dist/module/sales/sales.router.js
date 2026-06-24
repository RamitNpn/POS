"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesRouter = void 0;
const express_1 = require("@ts-rest/express");
const sales_contract_1 = require("../../contract/sales/sales.contract");
const sales_query_1 = require("./sales.query");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const s = (0, express_1.initServer)();
exports.salesRouter = s.router(sales_contract_1.salesContract, {
    getSalesAnalytics: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("cashier", "admin")],
        handler: sales_query_1.salesQueryHandler.getSalesAnalytics,
    },
    getTopSellingItems: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("cashier", "admin")],
        handler: sales_query_1.salesQueryHandler.getTopSellingItems,
    },
});
