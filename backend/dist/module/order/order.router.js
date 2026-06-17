"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
const express_1 = require("@ts-rest/express");
const order_contract_1 = require("../../contract/order/order.contract");
const order_mutation_1 = require("./order.mutation");
const order_query_1 = require("./order.query");
const s = (0, express_1.initServer)();
exports.orderRouter = s.router(order_contract_1.orderContract, {
    createOrder: order_mutation_1.orderMutationHandler.createOrder,
    // updateOrder: orderMutationHandler.updateOrder,
    updatePaymentStatus: order_mutation_1.orderMutationHandler.updatePaymentStatus,
    removeOrder: order_mutation_1.orderMutationHandler.removeOrder,
    getAllOrders: order_query_1.orderQueryHandler.getAllOrders,
    getOrderByID: order_query_1.orderQueryHandler.getOrderByID,
    getActiveOrderByTable: order_query_1.orderQueryHandler.getActiveOrderByTable,
});
exports.default = exports.orderRouter;
