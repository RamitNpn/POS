import { initServer } from "@ts-rest/express";

import { orderContract } from "../../contract/order/order.contract";

import { orderMutationHandler } from "./order.mutation";
import { orderQueryHandler } from "./order.query";

const s = initServer();

export const orderRouter = s.router(orderContract, {
  createOrder: orderMutationHandler.createOrder,
  updateOrder: orderMutationHandler.updateOrder,
  removeOrder: orderMutationHandler.removeOrder,

  getAllOrders: orderQueryHandler.getAllOrders,
  getOrderByID: orderQueryHandler.getOrderByID,
});

export default orderRouter;