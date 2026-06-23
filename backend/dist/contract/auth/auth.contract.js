"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authContract = void 0;
const core_1 = require("@ts-rest/core");
const zod_1 = require("zod");
const commonSchema_1 = require("../commonSchema");
const auth_schema_1 = require("./auth.schema");
const c = (0, core_1.initContract)();
exports.authContract = c.router({
    login: {
        method: "POST",
        path: "/auth/login",
        summary: "Authenticate a user and return user profile",
        body: auth_schema_1.loginSchema,
        responses: {
            200: auth_schema_1.loginResponseSchema,
            400: commonSchema_1.errorSchema,
            401: commonSchema_1.errorSchema,
            403: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    logout: {
        method: "POST",
        path: "/auth/logout",
        summary: "Clear authentication session",
        body: zod_1.z.object({}),
        responses: {
            200: auth_schema_1.logoutResponseSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    getMe: {
        method: "GET",
        path: "/auth/me",
        summary: "Get the authenticated user profile",
        responses: {
            200: auth_schema_1.getMeResponseSchema,
            401: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
});
