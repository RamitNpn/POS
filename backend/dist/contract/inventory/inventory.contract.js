"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryContract = void 0;
const core_1 = require("@ts-rest/core");
const zod_1 = require("zod");
const inventory_schema_1 = require("./inventory.schema");
const commonSchema_1 = require("../commonSchema");
const c = (0, core_1.initContract)();
exports.inventoryContract = c.router({
    createInventory: {
        method: "POST",
        path: "/inventory",
        summary: "Create an inventory",
        body: inventory_schema_1.createInventorySchema,
        responses: {
            201: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    getAllInventory: {
        method: "GET",
        path: "/inventory",
        summary: "Gel all inventory records by pagination",
        query: zod_1.z.object({
            page: zod_1.z.coerce.number().optional(),
            limit: zod_1.z.coerce.number().optional(),
            search: zod_1.z.string().optional(),
            category: zod_1.z.string().optional(),
        }),
        responses: {
            200: zod_1.z.object({
                data: inventory_schema_1.getAllInventorySchema,
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
    getInventoryByID: {
        method: "GET",
        path: "/inventory/:inventoryID",
        summary: "Get an inventory record by ID",
        pathParams: zod_1.z.object({
            inventoryID: zod_1.z.string(),
        }),
        responses: {
            200: inventory_schema_1.getInventoryByIdSchema,
            404: commonSchema_1.errorSchema,
        },
    },
    updateInventory: {
        method: "PUT",
        path: "/inventory/:inventoryID",
        summary: "Update an inventory record",
        pathParams: zod_1.z.object({
            inventoryID: zod_1.z.string(),
        }),
        body: inventory_schema_1.updateInventorySchema,
        responses: {
            200: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            404: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    removeInventory: {
        method: "DELETE",
        path: "/inventory/:inventoryID",
        summary: "Delete an inventory record",
        pathParams: zod_1.z.object({
            inventoryID: zod_1.z.string(),
        }),
        body: zod_1.z.object({}),
        responses: {
            200: commonSchema_1.successSchema,
            404: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
});
