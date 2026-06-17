"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuItemContract = void 0;
const core_1 = require("@ts-rest/core");
const zod_1 = require("zod");
const menu_item_schema_1 = require("./menu-item.schema");
const commonSchema_1 = require("../commonSchema");
const c = (0, core_1.initContract)();
exports.menuItemContract = c.router({
    createMenuItem: {
        method: "POST",
        path: "/menu-item",
        summary: "Create a menu item",
        body: menu_item_schema_1.createMenuItemSchema,
        responses: {
            201: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    getAllMenuItems: {
        method: "GET",
        path: "/menu-item",
        summary: "Get all menu item by pagination",
        query: zod_1.z.object({
            page: zod_1.z.coerce.number().optional(),
            limit: zod_1.z.coerce.number().optional(),
            search: zod_1.z.string().optional(),
        }),
        responses: {
            200: zod_1.z.object({
                data: menu_item_schema_1.getAllMenuItemsSchema,
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
    getMenuItemByID: {
        method: "GET",
        path: "/menu-item/:itemID",
        summary: "Get a menu item by its ID",
        pathParams: zod_1.z.object({
            itemID: zod_1.z.string(),
        }),
        responses: {
            200: menu_item_schema_1.getMenuItemByIdSchema,
            404: commonSchema_1.errorSchema,
        },
    },
    updateMenuItem: {
        method: "PUT",
        path: "/menu-item/:itemID",
        summary: "Update a menu item by its ID",
        pathParams: zod_1.z.object({
            itemID: zod_1.z.string(),
        }),
        body: menu_item_schema_1.updateMenuItemSchema,
        responses: {
            200: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            404: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    removeMenuItem: {
        method: "DELETE",
        path: "/menu-item/:itemID",
        summary: "Delete a menu item",
        pathParams: zod_1.z.object({
            itemID: zod_1.z.string(),
        }),
        body: zod_1.z.object({}),
        responses: {
            200: commonSchema_1.successSchema,
            404: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
});
