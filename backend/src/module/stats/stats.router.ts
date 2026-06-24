import { initServer } from "@ts-rest/express";
import { statsContract } from "../../contract/stats/stats.contract";
import { statsQueryHandler } from "./stats.query";

import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware";

const s = initServer();

export const statsRouter = s.router(statsContract, {
  getDashboardStats: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: statsQueryHandler.getDashboardStats,
  },

  getTableStats: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: statsQueryHandler.getTableStats,
  },

  getRevenueChart: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: statsQueryHandler.getRevenueChart,
  },

  getRevenueStats: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: statsQueryHandler.getRevenueStats,
  },

  getProfitLossStats: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: statsQueryHandler.getProfitLossStats,
  },

  cashierCheckoutStats: {
    middleware: [verifyToken, authorizeRoles("cashier", "admin")],
    handler: statsQueryHandler.getCashierCheckoutStats,
  },
});
