import { initServer } from "@ts-rest/express";
import { reportContract } from "../../contract/daily-report/report.contract";
import { reportMutationHandler } from "./report.mutation";
import { reportQueryHandler } from "./report.query";

const s = initServer();

export const reportRouter = s.router(reportContract, {
  generateDailyReport: reportMutationHandler.generateDailyReport,
  getDailyReports: reportQueryHandler.getDailyReports,
});
