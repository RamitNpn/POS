import { initServer } from "@ts-rest/express";
import { salesContract } from "../../contract/sales/sales.contract";
import { salesQueryHandler } from "./sales.query";

const s = initServer();

export const salesRouter = s.router(salesContract, {
  getSalesAnalytics: salesQueryHandler.getSalesAnalytics,
  getTopSellingItems: salesQueryHandler.getTopSellingItems,
});
