"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityLogContract = void 0;
const core_1 = require("@ts-rest/core");
const zod_1 = require("zod");
const commonSchema_1 = require("../commonSchema");
const log_schema_1 = require("./log.schema");
const c = (0, core_1.initContract)();
exports.activityLogContract = c.router({
    createActivityLog: {
        summary: "Create a log",
        method: "POST",
        path: "/activity-log",
        body: log_schema_1.createActivityLogSchema,
        responses: {
            201: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    getAllActivityLogs: {
        summary: "Get all logs",
        method: "GET",
        path: "/activity-log",
        query: zod_1.z.object({
            page: zod_1.z.coerce.number().optional(),
            limit: zod_1.z.coerce.number().optional(),
            search: zod_1.z.string().optional(),
            module: zod_1.z.string().optional(),
            userId: zod_1.z.string().optional(),
        }),
        responses: {
            200: zod_1.z.object({
                data: log_schema_1.getAllActivityLogs,
                pagination: zod_1.z.object({
                    page: zod_1.z.number(),
                    limit: zod_1.z.number(),
                    total: zod_1.z.number(),
                    totalPages: zod_1.z.number(),
                }),
            }),
        },
    },
    getActivityLogByID: {
        summary: "Get log by ID",
        method: "GET",
        path: "/activity-log/:logId",
        responses: {
            200: log_schema_1.activityLogSchema,
            404: commonSchema_1.errorSchema,
        },
    },
    deleteActivityLog: {
        summary: "Delete log",
        method: "DELETE",
        path: "/activity-log/:logId",
        body: zod_1.z.object({}),
        responses: {
            200: commonSchema_1.successSchema,
            404: commonSchema_1.errorSchema,
        },
    },
});
