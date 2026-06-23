import { initContract } from "@ts-rest/core";
import { z } from "zod";

import { errorSchema, successSchema } from "../commonSchema";
import {
  dailyReportsResponseSchema,
  generateReportResponseSchema,
} from "./report.schema";

const c = initContract();

export const reportContract = c.router({
  generateDailyReport: {
    method: "POST",
    path: "/reports/daily/generate",
    summary: "Create a daily report",
    body: z.object({}),
    responses: {
      200: generateReportResponseSchema,
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getDailyReports: {
    method: "GET",
    path: "/reports/daily",
    summary: "Get all daily reports",
    query: z.object({
      page: z.coerce.number().default(1),
      limit: z.coerce.number().default(10),
      to: z.string().optional(),
      from: z.string().optional(),
    }),
    responses: {
      200: dailyReportsResponseSchema,
    },
  },
});
