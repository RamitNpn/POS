"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleContract = void 0;
const core_1 = require("@ts-rest/core");
const zod_1 = require("zod");
const commonSchema_1 = require("../commonSchema");
const role_schema_1 = require("./role.schema");
const c = (0, core_1.initContract)();
exports.roleContract = c.router({
    createRole: {
        method: "POST",
        path: "/role",
        summary: "Create a new role",
        body: role_schema_1.createRoleSchema,
        responses: {
            201: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    getAllRoles: {
        method: "GET",
        path: "/role",
        summary: "Get a paginated list of roles with optional search",
        query: zod_1.z.object({
            page: zod_1.z.coerce.number().optional(),
            limit: zod_1.z.coerce.number().optional(),
            search: zod_1.z.string().optional(),
        }),
        responses: {
            200: zod_1.z.object({
                data: role_schema_1.getAllRolesSchema,
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
    getRoleByID: {
        method: "GET",
        path: "/role/:roleID",
        summary: "Get role details by ID",
        pathParams: zod_1.z.object({
            roleID: zod_1.z.string(),
        }),
        responses: {
            200: role_schema_1.getRoleByIdSchema,
            404: commonSchema_1.errorSchema,
        },
    },
    updateRole: {
        method: "PUT",
        path: "/role/:roleID",
        summary: "Update role details by ID",
        pathParams: zod_1.z.object({
            roleID: zod_1.z.string(),
        }),
        body: role_schema_1.updateRoleSchema,
        responses: {
            200: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            404: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    removeRole: {
        method: "DELETE",
        path: "/role/:roleID",
        summary: "Remove a role by ID",
        pathParams: zod_1.z.object({
            roleID: zod_1.z.string(),
        }),
        body: zod_1.z.object({}),
        responses: {
            200: commonSchema_1.successSchema,
            404: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
});
