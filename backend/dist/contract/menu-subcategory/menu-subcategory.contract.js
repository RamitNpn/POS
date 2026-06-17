"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuSubCategoryContract = void 0;
const core_1 = require("@ts-rest/core");
const zod_1 = require("zod");
const menu_subcategory_schema_1 = require("./menu-subcategory.schema");
const commonSchema_1 = require("../commonSchema");
const c = (0, core_1.initContract)();
exports.menuSubCategoryContract = c.router({
    createMenuSubCategory: {
        method: "POST",
        path: "/menu-subcategory",
        summary: "Create a menu sub-category",
        body: menu_subcategory_schema_1.createMenuSubCategorySchema,
        responses: {
            201: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    getAllMenuSubCategories: {
        method: "GET",
        path: "/menu-subcategory",
        summary: "Get a paginated list of menu-subcategory with optional search",
        query: zod_1.z.object({
            page: zod_1.z.coerce.number().optional(),
            limit: zod_1.z.coerce.number().optional(),
            search: zod_1.z.string().optional(),
            categoryId: zod_1.z.string().optional(),
        }),
        responses: {
            200: zod_1.z.object({
                data: menu_subcategory_schema_1.getAllMenuSubCategoriesSchema,
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
    getMenuSubCategoryByID: {
        method: "GET",
        path: "/menu-subcategory/:subCategoryID",
        summary: "Get menu-subcategory details by ID",
        pathParams: zod_1.z.object({
            subCategoryID: zod_1.z.string(),
        }),
        responses: {
            200: menu_subcategory_schema_1.getMenuSubCategoryByIdSchema,
            404: commonSchema_1.errorSchema,
        },
    },
    updateMenuSubCategory: {
        method: "PUT",
        path: "/menu-subcategory/:subCategoryID",
        summary: "Update menu-subcategory details by ID",
        pathParams: zod_1.z.object({
            subCategoryID: zod_1.z.string(),
        }),
        body: menu_subcategory_schema_1.updateMenuSubCategorySchema,
        responses: {
            200: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            404: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    removeMenuSubCategory: {
        method: "DELETE",
        path: "/menu-subcategory/:subCategoryID",
        summary: "Remove a menu-subcategory by ID",
        pathParams: zod_1.z.object({
            subCategoryID: zod_1.z.string(),
        }),
        body: zod_1.z.object({}),
        responses: {
            200: commonSchema_1.successSchema,
            404: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
});
