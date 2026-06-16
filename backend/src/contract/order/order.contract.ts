import { initContract } from "@ts-rest/core";
import { z } from "zod";

import {
  createOrderSchema,
  getAllOrdersSchema,
  getOrderByIdSchema,
  updateOrderSchema,
} from "./order.schema";

import { errorSchema, successSchema } from "../commonSchema";

const c = initContract();

export const orderContract = c.router({
  createOrder: {
    method: "POST",
    path: "/order",
    summary: "Create order or reorder",
    body: createOrderSchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllOrders: {
    method: "GET",
    path: "/order",
    summary: "Get all orders",
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      status: z.string().optional(),
      tableId: z.string().optional(),
      search: z.string().optional(),
    }),
    responses: {
      200: z.object({
        data: getAllOrdersSchema,
      }),
      500: errorSchema,
    },
  },

  getOrderByID: {
    method: "GET",
    path: "/order/:orderID",
    summary: "Get order by id",
    pathParams: z.object({
      orderID: z.string(),
    }),
    responses: {
      200: getOrderByIdSchema,
      404: errorSchema,
    },
  },

  getActiveOrderByTable: {
    method: "GET",
    path: "/order/table/:tableID",
    summary: "Get active order by table",
    pathParams: z.object({
      tableID: z.string(),
    }),
    responses: {
      200: getOrderByIdSchema,
      404: errorSchema,
    },
  },

  updateOrder: {
    method: "PUT",
    path: "/order/:orderID",
    summary: "Update order",
    pathParams: z.object({
      orderID: z.string(),
    }),
    body: updateOrderSchema,
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
    },
  },

  removeOrder: {
    method: "DELETE",
    path: "/order/:orderID",
    summary: "Delete order",
    pathParams: z.object({
      orderID: z.string(),
    }),
    body: z.object({}),
    responses: {
      200: successSchema,
      404: errorSchema,
    },
  },
});
