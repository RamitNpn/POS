import { initContract } from "@ts-rest/core";
import { z } from "zod";

import {
  createOrderSchema,
  updateOrderSchema,
  getOrderByIdSchema,
  getAllOrdersSchema,
} from "./order.schema";

import {
  successSchema,
  errorSchema,
} from "../commonSchema";

const c = initContract();

export const orderContract = c.router({
  createOrder: {
    method: "POST",
    path: "/orders",
    summary: "Create an order",
    body: createOrderSchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllOrders: {
    method: "GET",
    path: "/orders",
    summary: "Get all orders by pagination",
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
        pagination: z.object({
          page: z.number(),
          limit: z.number(),
          total: z.number(),
          totalPages: z.number(),
        }),
      }),
      500: errorSchema,
    },
  },

  getOrderByID: {
    method: "GET",
    path: "/orders/:orderID",
    summary: "Get an order by its ID",
    pathParams: z.object({
      orderID: z.string(),
    }),
    responses: {
      200: getOrderByIdSchema,
      404: errorSchema,
    },
  },

  updateOrder: {
    method: "PUT",
    path: "/orders/:orderID",
    summary: "Update an order",
    pathParams: z.object({
      orderID: z.string(),
    }),
    body: updateOrderSchema,
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  removeOrder: {
    method: "DELETE",
    path: "/orders/:orderID",
    summary: "Delete an order",
    pathParams: z.object({
      orderID: z.string(),
    }),
    body: z.object({}),
    responses: {
      200: successSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
});