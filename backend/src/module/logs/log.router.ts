import { initServer } from "@ts-rest/express";
import { activityLogContract } from "../../contract/logs/log.contract";
import { activityLogMutationHandler } from "./log.mutation";
import { activityLogQueryHandler } from "./log.query";

const s = initServer();

export const activityLogRouter = s.router(activityLogContract, {
  createActivityLog: activityLogMutationHandler.createActivityLog,
  deleteActivityLog: activityLogMutationHandler.deleteActivityLog,

  getAllActivityLogs: activityLogQueryHandler.getAllActivityLogs,
  getActivityLogByID: activityLogQueryHandler.getActivityLogByID,
});