import { initServer } from "@ts-rest/express";

import { orderContract } from "../../contract/order/order.contract";

import { orderMutationHandler } from "./order.mutation";
import { orderQueryHandler } from "./order.query";

import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware";

const s = initServer();

export const orderRouter = s.router(orderContract, {
  createOrder: {
    middleware: [verifyToken, authorizeRoles("waiter")],
    handler: orderMutationHandler.createOrder,
  },

  updatePaymentStatus: {
    middleware: [verifyToken, authorizeRoles("cashier", "admin")],
    handler: orderMutationHandler.updatePaymentStatus,
  },

  removeOrder: {
    middleware: [verifyToken, authorizeRoles("cashier", "admin")],
    handler: orderMutationHandler.removeOrder as any,
  },

  getAllOrders: {
    middleware: [verifyToken, authorizeRoles("cashier", "admin", "waiter")],
    handler: orderQueryHandler.getAllOrders,
  },

  getOrderByID: {
    middleware: [verifyToken, authorizeRoles("cashier", "admin", "waiter")],
    handler: orderQueryHandler.getOrderByID,
  },

  getActiveOrderByTable: {
    middleware: [verifyToken, authorizeRoles("cashier", "admin", "waiter")],
    handler: orderQueryHandler.getActiveOrderByTable,
  },

  getOrdersByDate: {
    middleware: [verifyToken, authorizeRoles("cashier", "admin", "waiter")],
    handler: orderQueryHandler.getOrdersByDate,
  },
});
