"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableContract = void 0;
const core_1 = require("@ts-rest/core");
const zod_1 = require("zod");
const table_schema_1 = require("./table.schema");
const commonSchema_1 = require("../commonSchema");
const c = (0, core_1.initContract)();
exports.tableContract = c.router({
    createTable: {
        method: "POST",
        path: "/table",
        summary: "Create a new table",
        body: table_schema_1.createTableSchema,
        responses: {
            201: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    getAllTables: {
        method: "GET",
        path: "/table",
        summary: "Get all tables with pagination and optional filters",
        query: zod_1.z.object({
            page: zod_1.z.coerce.number().optional(),
            limit: zod_1.z.coerce.number().optional(),
            search: zod_1.z.string().optional(),
            status: zod_1.z.string().optional(),
            sectionId: zod_1.z.string().optional(),
        }),
        responses: {
            200: zod_1.z.object({
                data: table_schema_1.getAllTablesSchema,
                pagination: zod_1.z.object({
                    page: zod_1.z.number(),
                    limit: zod_1.z.number(),
                    total: zod_1.z.number(),
                    totalPages: zod_1.z.number(),
                }),
            }),
            500: commonSchema_1.errorSchema,
        },
    },
    getTableByID: {
        method: "GET",
        path: "/table/:tableID",
        summary: "Get a table by its ID",
        pathParams: zod_1.z.object({
            tableID: zod_1.z.string(),
        }),
        responses: {
            200: table_schema_1.getTableByIdSchema,
            404: commonSchema_1.errorSchema,
        },
    },
    updateTable: {
        method: "PUT",
        path: "/table/:tableID",
        summary: "Update a table by its ID",
        pathParams: zod_1.z.object({
            tableID: zod_1.z.string(),
        }),
        body: table_schema_1.updateTableSchema,
        responses: {
            200: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            404: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    updateTableStatus: {
        method: "PUT",
        path: "/table/status/:tableID",
        pathParams: zod_1.z.object({
            tableID: zod_1.z.string(),
        }),
        body: table_schema_1.updateTableStatusSchema,
        responses: {
            200: commonSchema_1.successSchema,
            404: commonSchema_1.errorSchema,
        },
    },
    removeTable: {
        method: "DELETE",
        path: "/table/:tableID",
        summary: "Remove a table by its ID",
        pathParams: zod_1.z.object({
            tableID: zod_1.z.string(),
        }),
        body: zod_1.z.object({}),
        responses: {
            200: commonSchema_1.successSchema,
            404: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
});
