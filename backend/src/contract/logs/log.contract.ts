import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { errorSchema, successSchema } from "../commonSchema";
import {
  activityLogSchema,
  createActivityLogSchema,
  getAllActivityLogs,
} from "./log.schema";

const c = initContract();

export const activityLogContract = c.router({
  createActivityLog: {
    summary: "Create a log",
    method: "POST",
    path: "/activity-log",
    body: createActivityLogSchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllActivityLogs: {
    summary: "Get all logs",
    method: "GET",
    path: "/activity-log",
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      search: z.string().optional(),
      module: z.string().optional(),
      userId: z.string().optional(),
    }),
    responses: {
      200: z.object({
        data: getAllActivityLogs,
        pagination: z.object({
          page: z.number(),
          limit: z.number(),
          total: z.number(),
          totalPages: z.number(),
        }),
      }),
    },
  },

  getActivityLogByID: {
    summary: "Get log by ID",
    method: "GET",
    path: "/activity-log/:logId",
    responses: {
      200: activityLogSchema,
      404: errorSchema,
    },
  },

  deleteActivityLog: {
    summary: "Delete log",
    method: "DELETE",
    path: "/activity-log/:logId",
    body: z.object({}),
    responses: {
      200: successSchema,
      404: errorSchema,
    },
  },
});