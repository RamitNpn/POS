import { AppRouteQueryImplementation } from "@ts-rest/express";
import { activityLogContract } from "../../contract/logs/log.contract";
import logRepository from "../../repository/log.repository";

export const getAllActivityLogs: AppRouteQueryImplementation<
  typeof activityLogContract.getAllActivityLogs
> = async ({ req }) => {
  try {
    console.log("[GET ALL ACTIVITY LOGS] QUERY:", req.query);

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit);

    console.log("[GET ALL ACTIVITY LOGS] PARSED PAGINATION:", {
      page,
      limit,
    });

    const skip = (page - 1) * limit;

    console.log("[GET ALL ACTIVITY LOGS] SKIP VALUE:", skip);

    console.log("[GET ALL ACTIVITY LOGS] FILTERS:", {
      search: req.query.search,
      module: req.query.module,
      userId: req.query.userId,
    });

    console.log("[GET ALL ACTIVITY LOGS] FETCHING FROM DB...");

    const { data, total } = await logRepository.getAll({
      skip,
      limit,
      search: req.query.search as string,
      module: req.query.module as string,
      userId: req.query.userId as string,
    });

    console.log("[GET ALL ACTIVITY LOGS] DB RESULT:", {
      returned: data?.length,
      total,
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

    console.log("[GET ALL ACTIVITY LOGS] FORMATTED COUNT:", formatted.length);

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
    console.error("[GET ALL ACTIVITY LOGS] ERROR:", error);
    console.error("[GET ALL ACTIVITY LOGS] QUERY:", req.query);

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
    console.log("[GET ACTIVITY LOG BY ID] PARAMS:", req.params);

    const log = (await logRepository.getByID(req.params.logId)) as any;

    console.log("[GET ACTIVITY LOG BY ID] DB RESULT:", log);

    if (!log) {
      console.log("[GET ACTIVITY LOG BY ID] NOT FOUND:", req.params.logId);

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
    console.error("[GET ACTIVITY LOG BY ID] ERROR:", error);
    console.error("[GET ACTIVITY LOG BY ID] PARAMS:", req.params);

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
