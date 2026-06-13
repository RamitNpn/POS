import { initContract } from "@ts-rest/core";
import { z } from "zod";

import {
  createMenuSubCategorySchema,
  updateMenuSubCategorySchema,
  getMenuSubCategoryByIdSchema,
  getAllMenuSubCategoriesSchema,
} from "./menu-subcategory.schema";

import { successSchema, errorSchema } from "../commonSchema";

const c = initContract();

export const menuSubCategoryContract = c.router({
  createMenuSubCategory: {
    method: "POST",
    path: "/menu-subcategory",
    summary: "Create a menu sub-category",
    body: createMenuSubCategorySchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllMenuSubCategories: {
    method: "GET",
    path: "/menu-subcategory",
    summary: "Get a paginated list of menu-subcategory with optional search",
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      search: z.string().optional(),
      categoryId: z.string().optional(),
    }),
    responses: {
      200: z.object({
        data: getAllMenuSubCategoriesSchema,
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

  getMenuSubCategoryByID: {
    method: "GET",
    path: "/menu-subcategory/:subCategoryID",
    summary: "Get menu-subcategory details by ID",
    pathParams: z.object({
      subCategoryID: z.string(),
    }),
    responses: {
      200: getMenuSubCategoryByIdSchema,
      404: errorSchema,
    },
  },

  updateMenuSubCategory: {
    method: "PUT",
    path: "/menu-subcategory/:subCategoryID",
    summary: "Update menu-subcategory details by ID",
    pathParams: z.object({
      subCategoryID: z.string(),
    }),
    body: updateMenuSubCategorySchema,
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  removeMenuSubCategory: {
    method: "DELETE",
    path: "/menu-subcategory/:subCategoryID",
    summary: "Remove a menu-subcategory by ID",
    pathParams: z.object({
      subCategoryID: z.string(),
    }),
    body: z.object({}),
    responses: {
      200: successSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
});