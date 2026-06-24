import { initServer } from "@ts-rest/express";
import { reportContract } from "../../contract/daily-report/report.contract";
import { reportMutationHandler } from "./report.mutation";
import { reportQueryHandler } from "./report.query";
import {
  verifyToken,
  authorizeRoles,
} from "../../middleware/auth.middleware";

const s = initServer();

export const reportRouter = s.router(reportContract, {
  generateDailyReport: {
    middleware: [
      verifyToken,
      authorizeRoles("admin"),
    ],
    handler: reportMutationHandler.generateDailyReport,
  },

  getDailyReports: {
    middleware: [
      verifyToken,
      authorizeRoles("admin"),
    ],
    handler: reportQueryHandler.getDailyReports,
  },
});