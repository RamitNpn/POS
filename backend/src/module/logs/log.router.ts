import { initServer } from "@ts-rest/express";
import { activityLogContract } from "../../contract/logs/log.contract";
import { activityLogMutationHandler } from "./log.mutation";
import { activityLogQueryHandler } from "./log.query";
import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware";

const s = initServer();

export const activityLogRouter = s.router(activityLogContract, {
  createActivityLog: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: activityLogMutationHandler.createActivityLog,
  },

  deleteActivityLog: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: activityLogMutationHandler.deleteActivityLog as any,
  },

  getAllActivityLogs: {
    middleware: [verifyToken, authorizeRoles("waiter", "cashier", "admin")],
    handler: activityLogQueryHandler.getAllActivityLogs,
  },

  getActivityLogByID: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: activityLogQueryHandler.getActivityLogByID,
  },
});
