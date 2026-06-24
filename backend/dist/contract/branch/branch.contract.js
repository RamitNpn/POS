"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.branchContract = void 0;
const core_1 = require("@ts-rest/core");
const zod_1 = require("zod");
const commonSchema_1 = require("../commonSchema");
const branch_schema_1 = require("./branch.schema");
const c = (0, core_1.initContract)();
exports.branchContract = c.router({
    createBranch: {
        method: "POST",
        path: "/branch",
        summary: "Create a new branch",
        body: branch_schema_1.createBranchSchema,
        responses: {
            201: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    getAllBranches: {
        method: "GET",
        path: "/branch",
        summary: "Get a paginated list of branches with optional search and status filter",
        query: zod_1.z.object({
            page: zod_1.z.coerce.number().optional(),
            limit: zod_1.z.coerce.number().optional(),
            search: zod_1.z.string().optional(),
            status: zod_1.z.enum(["active", "inactive"]).optional(),
        }),
        responses: {
            200: zod_1.z.object({
                data: branch_schema_1.getAllBranchesSchema,
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
    getBranchByID: {
        method: "GET",
        path: "/branch/:branchID",
        summary: "Get branch details by ID",
        pathParams: zod_1.z.object({
            branchID: zod_1.z.string(),
        }),
        responses: {
            200: branch_schema_1.getBranchByIdSchema,
            404: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    updateBranch: {
        method: "PUT",
        path: "/branch/:branchID",
        summary: "Update branch details by ID",
        pathParams: zod_1.z.object({
            branchID: zod_1.z.string(),
        }),
        body: branch_schema_1.updateBranchSchema,
        responses: {
            200: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            404: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    deleteBranch: {
        method: "DELETE",
        path: "/branch/:branchID",
        summary: "Delete a branch by ID",
        pathParams: zod_1.z.object({
            branchID: zod_1.z.string(),
        }),
        body: zod_1.z.object({}).optional(),
        responses: {
            200: commonSchema_1.successSchema,
            404: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
});
