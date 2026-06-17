"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuCategoryContract = void 0;
const core_1 = require("@ts-rest/core");
const zod_1 = require("zod");
const menu_category_schema_1 = require("./menu-category.schema");
const commonSchema_1 = require("../commonSchema");
const c = (0, core_1.initContract)();
exports.menuCategoryContract = c.router({
    createMenuCategory: {
        method: "POST",
        path: "/menu-category",
        summary: "Create a new menu category",
        body: menu_category_schema_1.createMenuCategorySchema,
        responses: {
            201: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    getAllMenuCategories: {
        method: "GET",
        path: "/menu-category",
        summary: "Get all menu categories with pagination and optional search",
        query: zod_1.z.object({
            page: zod_1.z.coerce.number().optional(),
            limit: zod_1.z.coerce.number().optional(),
            search: zod_1.z.string().optional(),
            isActive: zod_1.z.coerce.boolean().optional(),
        }),
        responses: {
            200: zod_1.z.object({
                data: menu_category_schema_1.getAllMenuCategoriesSchema,
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
    getMenuCategoryByID: {
        method: "GET",
        path: "/menu-category/:categoryID",
        summary: "Get a menu category by its ID",
        pathParams: zod_1.z.object({
            categoryID: zod_1.z.string(),
        }),
        responses: {
            200: menu_category_schema_1.getMenuCategoryByIdSchema,
            404: commonSchema_1.errorSchema,
        },
    },
    updateMenuCategory: {
        method: "PUT",
        path: "/menu-category/:categoryID",
        summary: "Update an existing menu category",
        pathParams: zod_1.z.object({
            categoryID: zod_1.z.string(),
        }),
        body: menu_category_schema_1.updateMenuCategorySchema,
        responses: {
            200: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            404: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    removeMenuCategory: {
        method: "DELETE",
        path: "/menu-category/:categoryID",
        summary: "Remove a menu category by its ID",
        pathParams: zod_1.z.object({
            categoryID: zod_1.z.string(),
        }),
        body: zod_1.z.object({}),
        responses: {
            200: commonSchema_1.successSchema,
            404: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
});
