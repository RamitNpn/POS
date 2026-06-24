import { AppRouteMutationImplementation } from "@ts-rest/express";
import { activityLogContract } from "../../contract/logs/log.contract";
import logRepository from "../../repository/log.repository";
import mongoose from "mongoose";

export const createActivityLog: AppRouteMutationImplementation<
  typeof activityLogContract.createActivityLog
> = async ({ req }) => {
  try {
    console.log("[CREATE ACTIVITY LOG] REQUEST BODY:", req.body);

    const { userId, action, details, entityId, entityType, module } = req.body;

    console.log("[CREATE ACTIVITY LOG] PARSED DATA:", {
      userId,
      action,
      module,
      entityType,
      entityId,
    });

    console.log("[CREATE ACTIVITY LOG] CREATING LOG IN DB...");

    await logRepository.create({
      userId: new mongoose.Types.ObjectId(userId),
      action,
      details,
      module,
      entityId,
      entityType,
    });

    console.log("[CREATE ACTIVITY LOG] SUCCESS");

    return {
      status: 201,
      body: {
        success: true,
        message: "Activity log created successfully",
      },
    };
  } catch (error) {
    console.error("[CREATE ACTIVITY LOG] ERROR:", error);
    console.error("[CREATE ACTIVITY LOG] REQUEST BODY:", req.body);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const deleteActivityLog: AppRouteMutationImplementation<
  typeof activityLogContract.deleteActivityLog
> = async ({ req }) => {
  try {
    console.log("[DELETE ACTIVITY LOG] PARAMS:", req.params);

    const { logId } = req.params;

    console.log("[DELETE ACTIVITY LOG] LOG ID:", logId);

    const log = await logRepository.getByID(logId);

    console.log("[DELETE ACTIVITY LOG] DB RESULT:", log);

    if (!log) {
      console.log("[DELETE ACTIVITY LOG] NOT FOUND:", logId);

      return {
        status: 404,
        body: {
          success: false,
          error: "Activity log not found",
        },
      };
    }

    console.log("[DELETE ACTIVITY LOG] DELETING LOG...");

    await logRepository.delete(logId);

    console.log("[DELETE ACTIVITY LOG] SUCCESS DELETED:", logId);

    return {
      status: 200,
      body: {
        success: true,
        message: "Activity log deleted successfully",
      },
    };
  } catch (error) {
    console.error("[DELETE ACTIVITY LOG] ERROR:", error);
    console.error("[DELETE ACTIVITY LOG] PARAMS:", req.params);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const activityLogMutationHandler = {
  createActivityLog,
  deleteActivityLog,
};
