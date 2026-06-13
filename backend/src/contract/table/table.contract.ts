import { initContract } from "@ts-rest/core";
import { z } from "zod";

import {
  createTableSchema,
  updateTableSchema,
  getTableByIdSchema,
  getAllTablesSchema,
} from "./table.schema";

import { successSchema, errorSchema } from "../commonSchema";

const c = initContract();

export const tableContract = c.router({
  createTable: {
    method: "POST",
    path: "/table",
    summary: "Create a new table",
    body: createTableSchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllTables: {
    method: "GET",
    path: "/table",
    summary: "Get all tables with pagination and optional filters",
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      search: z.string().optional(),
      status: z.string().optional(),
      sectionId: z.string().optional(),
    }),
    responses: {
      200: z.object({
        data: getAllTablesSchema,
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

  getTableByID: {
    method: "GET",
    path: "/table/:tableID",
    summary: "Get a table by its ID",
    pathParams: z.object({
      tableID: z.string(),
    }),
    responses: {
      200: getTableByIdSchema,
      404: errorSchema,
    },
  },

  updateTable: {
    method: "PUT",
    path: "/table/:tableID",
  summary: "Update a table by its ID",
    pathParams: z.object({
      tableID: z.string(),
    }),
    body: updateTableSchema,
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  removeTable: {
    method: "DELETE",
    path: "/table/:tableID",
    summary: "Remove a table by its ID",
    pathParams: z.object({
      tableID: z.string(),
    }),
    body: z.object({}),
    responses: {
      200: successSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
});