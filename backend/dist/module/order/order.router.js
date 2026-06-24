"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
const express_1 = require("@ts-rest/express");
const order_contract_1 = require("../../contract/order/order.contract");
const order_mutation_1 = require("./order.mutation");
const order_query_1 = require("./order.query");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const s = (0, express_1.initServer)();
exports.orderRouter = s.router(order_contract_1.orderContract, {
    createOrder: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("waiter")],
        handler: order_mutation_1.orderMutationHandler.createOrder,
    },
    updatePaymentStatus: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("cashier", "admin")],
        handler: order_mutation_1.orderMutationHandler.updatePaymentStatus,
    },
    removeOrder: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("cashier", "admin")],
        handler: order_mutation_1.orderMutationHandler.removeOrder,
    },
    getAllOrders: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("cashier", "admin", "waiter")],
        handler: order_query_1.orderQueryHandler.getAllOrders,
    },
    getOrderByID: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("cashier", "admin", "waiter")],
        handler: order_query_1.orderQueryHandler.getOrderByID,
    },
    getActiveOrderByTable: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("cashier", "admin", "waiter")],
        handler: order_query_1.orderQueryHandler.getActiveOrderByTable,
    },
    getOrdersByDate: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("cashier", "admin", "waiter")],
        handler: order_query_1.orderQueryHandler.getOrdersByDate,
    },
});
