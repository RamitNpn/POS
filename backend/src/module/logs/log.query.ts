import { AppRouteQueryImplementation } from "@ts-rest/express";
import { activityLogContract } from "../../contract/logs/log.contract";
import logRepository from "../../repository/log.repository";

export const getAllActivityLogs: AppRouteQueryImplementation<
  typeof activityLogContract.getAllActivityLogs
> = async ({ req }) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit);

    const { data, total } = await logRepository.getAll({
      skip: (page - 1) * limit,
      limit,
      search: req.query.search as string,
      module: req.query.module as string,
      userId: req.query.userId as string,
    });

    const formatted = data.map((p: any) => ({
      _id: p._id.toString(),

      userId: p.userId?._id?.toString?.() ?? p.userId?.toString(),

      user: p.userId
        ? {
            name: p.userId.name,
            email: p.userId.email,
            role: p.userId.role,
          }
        : undefined,

      action: p.action,
      details: p.details,
      module: p.module,
      entityId: p.entityId,
      entityType: p.entityType,

      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return {
      status: 200,
      body: {
        data: formatted,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
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

export type PopulatedUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export const getActivityLogByID: AppRouteQueryImplementation<
  typeof activityLogContract.getActivityLogByID
> = async ({ req }) => {
  try {
    const log = (await logRepository.getByID(req.params.logId)) as any;

    if (!log) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Activity log not found",
        },
      };
    }

    const user = log.userId as PopulatedUser;

    return {
      status: 200,
      body: {
        _id: log._id.toString(),

        userId: user?._id?.toString(),

        user: user
          ? {
              name: user.name,
              email: user.email,
              role: user.role,
            }
          : undefined,

        action: log.action,
        details: log.details,
        module: log.module,
        entityId: log.entityId,
        entityType: log.entityType,

        createdAt: log.createdAt,
        updatedAt: log.updatedAt,
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

export const activityLogQueryHandler = {
  getAllActivityLogs,
  getActivityLogByID,
};
