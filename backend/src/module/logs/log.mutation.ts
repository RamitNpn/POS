import { AppRouteMutationImplementation } from "@ts-rest/express";
import { activityLogContract } from "../../contract/logs/log.contract";
import logRepository from "../../repository/log.repository";
import mongoose from "mongoose";

export const createActivityLog: AppRouteMutationImplementation<
  typeof activityLogContract.createActivityLog
> = async ({ req }) => {
  try {
    const { userId, action, details, entityId, entityType, module } = req.body;

    await logRepository.create({
      userId: new mongoose.Types.ObjectId(userId),
      action,
      details,
      module,
      entityId,
      entityType,
    });

    return {
      status: 201,
      body: {
        success: true,
        message: "Activity log created successfully",
      },
    };
  } catch (error) {
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
    const { logId } = req.params;

    const log = await logRepository.getByID(logId);

    if (!log) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Activity log not found",
        },
      };
    }

    await logRepository.delete(logId);

    return {
      status: 200,
      body: {
        success: true,
        message: "Activity log deleted successfully",
      },
    };
  } catch (error) {
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
