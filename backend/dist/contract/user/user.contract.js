"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userContract = void 0;
const core_1 = require("@ts-rest/core");
const zod_1 = require("zod");
const user_schema_1 = require("./user.schema");
const commonSchema_1 = require("../commonSchema");
const c = (0, core_1.initContract)();
exports.userContract = c.router({
    createUser: {
        method: "POST",
        path: "/user",
        summary: "Create a new user",
        body: user_schema_1.createUserSchema,
        responses: {
            201: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    getAllUsers: {
        method: "GET",
        path: "/user",
        summary: "Get a paginated list of users with optional search and role filtering",
        query: zod_1.z.object({
            page: zod_1.z.coerce.number().optional(),
            limit: zod_1.z.coerce.number().optional(),
            search: zod_1.z.string().optional(),
            role: zod_1.z.string().optional(),
        }),
        responses: {
            200: zod_1.z.object({
                data: user_schema_1.getAllUsersSchema,
            }),
            500: commonSchema_1.errorSchema,
        },
    },
    getUserByID: {
        method: "GET",
        path: "/user/:userID",
        summary: "Get user details by ID",
        pathParams: zod_1.z.object({
            userID: zod_1.z.string().min(1),
        }),
        responses: {
            200: user_schema_1.getUserByIdSchema,
            404: commonSchema_1.errorSchema,
        },
    },
    updateUser: {
        method: "PUT",
        path: "/user/:userID",
        summary: "Update user details by ID",
        pathParams: zod_1.z.object({
            userID: zod_1.z.string().min(1),
        }),
        body: zod_1.z.any(),
        responses: {
            200: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            404: commonSchema_1.errorSchema,
        },
    },
    removeUser: {
        method: "DELETE",
        path: "/user/:userID",
        summary: "Delete a user by ID",
        pathParams: zod_1.z.object({
            userID: zod_1.z.string(),
        }),
        body: zod_1.z.object({}).optional(),
        responses: {
            200: commonSchema_1.successSchema,
            404: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
});
