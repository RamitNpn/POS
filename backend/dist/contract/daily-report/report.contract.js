"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportContract = void 0;
const core_1 = require("@ts-rest/core");
const zod_1 = require("zod");
const commonSchema_1 = require("../commonSchema");
const report_schema_1 = require("./report.schema");
const c = (0, core_1.initContract)();
exports.reportContract = c.router({
    generateDailyReport: {
        method: "POST",
        path: "/reports/daily/generate",
        summary: "Create a daily report",
        body: zod_1.z.object({}),
        responses: {
            200: report_schema_1.generateReportResponseSchema,
            201: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    getDailyReports: {
        method: "GET",
        path: "/reports/daily",
        summary: "Get all daily reports",
        query: zod_1.z.object({
            page: zod_1.z.coerce.number().default(1),
            limit: zod_1.z.coerce.number().default(10),
            to: zod_1.z.string().optional(),
            from: zod_1.z.string().optional(),
        }),
        responses: {
            200: report_schema_1.dailyReportsResponseSchema,
        },
    },
});
