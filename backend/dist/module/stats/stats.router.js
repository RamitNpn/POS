"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsRouter = void 0;
const express_1 = require("@ts-rest/express");
const stats_contract_1 = require("../../contract/stats/stats.contract");
const stats_query_1 = require("./stats.query");
const s = (0, express_1.initServer)();
exports.statsRouter = s.router(stats_contract_1.statsContract, {
    getDashboardStats: stats_query_1.statsQueryHandler.getDashboardStats,
    getTableStats: stats_query_1.statsQueryHandler.getTableStats,
    getRevenueChart: stats_query_1.statsQueryHandler.getRevenueChart,
    getRevenueStats: stats_query_1.statsQueryHandler.getRevenueStats,
    getProfitLossStats: stats_query_1.statsQueryHandler.getProfitLossStats,
    cashierCheckoutStats: stats_query_1.statsQueryHandler.getCashierCheckoutStats,
});
