import { initContract } from "@ts-rest/core";
import { z } from "zod";

import {
  createMenuItemSchema,
  updateMenuItemSchema,
  getMenuItemByIdSchema,
  getAllMenuItemsSchema,
} from "./menu-item.schema";

import { successSchema, errorSchema } from "../commonSchema";

const c = initContract();

export const menuItemContract = c.router({
  createMenuItem: {
    method: "POST",
    path: "/menu-item",
    summary: "Create a menu item",
    body: createMenuItemSchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllMenuItems: {
    method: "GET",
    path: "/menu-item",
    summary: "Get all menu item by pagination",
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      search: z.string().optional(),
    }),
    responses: {
      200: z.object({
        data: getAllMenuItemsSchema,
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

  getMenuItemByID: {
    method: "GET",
    path: "/menu-item/:itemID",
    summary: "Get a menu item by its ID",
    pathParams: z.object({
      itemID: z.string(),
    }),
    responses: {
      200: getMenuItemByIdSchema,
      404: errorSchema,
    },
  },

  updateMenuItem: {
    method: "PUT",
    path: "/menu-item/:itemID",
    summary: "Update a menu item by its ID",
    pathParams: z.object({
      itemID: z.string(),
    }),
    body: updateMenuItemSchema,
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  removeMenuItem: {
    method: "DELETE",
    path: "/menu-item/:itemID",
    summary: "Delete a menu item",
    pathParams: z.object({
      itemID: z.string(),
    }),
    body: z.object({}),
    responses: {
      200: successSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
});