"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsRouter = void 0;
const express_1 = require("@ts-rest/express");
const stats_contract_1 = require("../../contract/stats/stats.contract");
const stats_query_1 = require("./stats.query");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const s = (0, express_1.initServer)();
exports.statsRouter = s.router(stats_contract_1.statsContract, {
    getDashboardStats: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: stats_query_1.statsQueryHandler.getDashboardStats,
    },
    getTableStats: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: stats_query_1.statsQueryHandler.getTableStats,
    },
    getRevenueChart: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: stats_query_1.statsQueryHandler.getRevenueChart,
    },
    getRevenueStats: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: stats_query_1.statsQueryHandler.getRevenueStats,
    },
    getProfitLossStats: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: stats_query_1.statsQueryHandler.getProfitLossStats,
    },
    cashierCheckoutStats: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("cashier", "admin")],
        handler: stats_query_1.statsQueryHandler.getCashierCheckoutStats,
    },
});
