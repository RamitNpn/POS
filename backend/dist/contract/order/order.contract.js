"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderContract = void 0;
const core_1 = require("@ts-rest/core");
const zod_1 = require("zod");
const order_schema_1 = require("./order.schema");
const commonSchema_1 = require("../commonSchema");
const c = (0, core_1.initContract)();
exports.orderContract = c.router({
    createOrder: {
        method: "POST",
        path: "/order",
        summary: "Create order or reorder",
        body: order_schema_1.createOrderSchema,
        responses: {
            201: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    getAllOrders: {
        method: "GET",
        path: "/order",
        summary: "Get all orders",
        query: zod_1.z.object({
            page: zod_1.z.coerce.number().optional(),
            limit: zod_1.z.coerce.number().optional(),
            status: zod_1.z.string().optional(),
            tableId: zod_1.z.string().optional(),
            search: zod_1.z.string().optional(),
        }),
        responses: {
            200: zod_1.z.object({
                data: order_schema_1.getAllOrdersSchema,
            }),
            500: commonSchema_1.errorSchema,
        },
    },
    getOrderByID: {
        method: "GET",
        path: "/order/:orderID",
        summary: "Get order by id",
        pathParams: zod_1.z.object({
            orderID: zod_1.z.string(),
        }),
        responses: {
            200: order_schema_1.getOrderByIdSchema,
            404: commonSchema_1.errorSchema,
        },
    },
    getActiveOrderByTable: {
        method: "GET",
        path: "/order/table/:tableID",
        summary: "Get active order by table",
        pathParams: zod_1.z.object({
            tableID: zod_1.z.string(),
        }),
        responses: {
            200: order_schema_1.getOrderByIdSchema,
            404: commonSchema_1.errorSchema,
        },
    },
    // updateOrder: {
    //   method: "PUT",
    //   path: "/order/:orderID",
    //   summary: "Update order",
    //   pathParams: z.object({
    //     orderID: z.string(),
    //   }),
    //   body: updateOrderSchema,
    //   responses: {
    //     200: successSchema,
    //     400: errorSchema,
    //     404: errorSchema,
    //   },
    // },
    updatePaymentStatus: {
        method: "PUT",
        path: "/order/payment/:orderID",
        pathParams: zod_1.z.object({
            orderID: zod_1.z.string(),
        }),
        body: order_schema_1.updatePaymentSchema,
        responses: {
            200: commonSchema_1.successSchema,
            404: commonSchema_1.errorSchema,
        },
    },
    removeOrder: {
        method: "DELETE",
        path: "/order/:orderID",
        summary: "Delete order",
        pathParams: zod_1.z.object({
            orderID: zod_1.z.string(),
        }),
        body: zod_1.z.object({}),
        responses: {
            200: commonSchema_1.successSchema,
            404: commonSchema_1.errorSchema,
        },
    },
});
