import { initContract } from "@ts-rest/core";
import { z } from "zod";

import {
  createMenuCategorySchema,
  updateMenuCategorySchema,
  getMenuCategoryByIdSchema,
  getAllMenuCategoriesSchema,
} from "./menu-category.schema";

import {
  successSchema,
  errorSchema,
} from "../commonSchema";

const c = initContract();

export const menuCategoryContract = c.router({
  createMenuCategory: {
    method: "POST",
    path: "/menu-category",
    summary: "Create a new menu category",
    body: createMenuCategorySchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllMenuCategories: {
    method: "GET",
    path: "/menu-category",
    summary: "Get all menu categories with pagination and optional search",
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      search: z.string().optional(),
      isActive: z.coerce.boolean().optional(),
    }),
    responses: {
      200: z.object({
        data: getAllMenuCategoriesSchema,
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

  getMenuCategoryByID: {
    method: "GET",
    path: "/menu-category/:categoryID",
    summary: "Get a menu category by its ID",
    pathParams: z.object({
      categoryID: z.string(),
    }),
    responses: {
      200: getMenuCategoryByIdSchema,
      404: errorSchema,
    },
  },

  updateMenuCategory: {
    method: "PUT",
    path: "/menu-category/:categoryID",
    summary: "Update an existing menu category",
    pathParams: z.object({
      categoryID: z.string(),
    }),
    body: updateMenuCategorySchema,
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  removeMenuCategory: {
    method: "DELETE",
    path: "/menu-category/:categoryID",
    summary: "Remove a menu category by its ID",
    pathParams: z.object({
      categoryID: z.string(),
    }),
    body: z.object({}),
    responses: {
      200: successSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
});