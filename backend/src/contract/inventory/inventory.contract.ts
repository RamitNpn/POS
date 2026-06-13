import { initContract } from "@ts-rest/core";
import { z } from "zod";

import {
  createInventorySchema,
  updateInventorySchema,
  getInventoryByIdSchema,
  getAllInventorySchema,
} from "./inventory.schema";

import {
  successSchema,
  errorSchema,
} from "../commonSchema";

const c = initContract();

export const inventoryContract = c.router({
  createInventory: {
    method: "POST",
    path: "/inventory",
    summary: "Create an inventory",
    body: createInventorySchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllInventory: {
    method: "GET",
    path: "/inventory",
    summary: "Gel all inventory records by pagination",
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      search: z.string().optional(),
      category: z.string().optional(),
    }),
    responses: {
      200: z.object({
        data: getAllInventorySchema,
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

  getInventoryByID: {
    method: "GET",
    path: "/inventory/:inventoryID",
    summary: "Get an inventory record by ID",
    pathParams: z.object({
      inventoryID: z.string(),
    }),
    responses: {
      200: getInventoryByIdSchema,
      404: errorSchema,
    },
  },

  updateInventory: {
    method: "PUT",
    path: "/inventory/:inventoryID",
    summary: "Update an inventory record",
    pathParams: z.object({
      inventoryID: z.string(),
    }),
    body: updateInventorySchema,
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  removeInventory: {
    method: "DELETE",
    path: "/inventory/:inventoryID",
    summary: "Delete an inventory record",
    pathParams: z.object({
      inventoryID: z.string(),
    }),
    body: z.object({}),
    responses: {
      200: successSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
});