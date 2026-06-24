import { initServer } from "@ts-rest/express";
import { salesContract } from "../../contract/sales/sales.contract";
import { salesQueryHandler } from "./sales.query";

import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware";

const s = initServer();

export const salesRouter = s.router(salesContract, {
  getSalesAnalytics: {
    middleware: [verifyToken, authorizeRoles("cashier", "admin")],
    handler: salesQueryHandler.getSalesAnalytics,
  },

  getTopSellingItems: {
    middleware: [verifyToken, authorizeRoles("cashier", "admin")],
    handler: salesQueryHandler.getTopSellingItems,
  },
});
