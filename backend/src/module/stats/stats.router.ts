import { initServer } from "@ts-rest/express";
import { statsContract } from "../../contract/stats/stats.contract";
import { statsQueryHandler } from "./stats.query";

const s = initServer();

export const statsRouter = s.router(statsContract, {
  getDashboardStats: statsQueryHandler.getDashboardStats,
  getTableStats: statsQueryHandler.getTableStats,
  getRevenueChart: statsQueryHandler.getRevenueChart,
  getRevenueStats: statsQueryHandler.getRevenueStats,
  getProfitLossStats: statsQueryHandler.getProfitLossStats,
  cashierCheckoutStats: statsQueryHandler.getCashierCheckoutStats,
});
