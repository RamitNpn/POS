import { initContract } from "@ts-rest/core";
import { z } from "zod";

import { errorSchema, successSchema } from "../commonSchema";
import {
  createBranchSchema,
  updateBranchSchema,
  getAllBranchesSchema,
  getBranchByIdSchema,
} from "./branch.schema";

const c = initContract();

export const branchContract = c.router({
  createBranch: {
    method: "POST",
    path: "/branch",
    summary: "Create a new branch",
    body: createBranchSchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllBranches: {
    method: "GET",
    path: "/branch",
    summary:
      "Get a paginated list of branches with optional search and status filter",
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      search: z.string().optional(),
      status: z.enum(["active", "inactive"]).optional(),
    }),
    responses: {
      200: z.object({
        data: getAllBranchesSchema,
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

  getBranchByID: {
    method: "GET",
    path: "/branch/:branchID",
    summary: "Get branch details by ID",
    pathParams: z.object({
      branchID: z.string(),
    }),
    responses: {
      200: getBranchByIdSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  updateBranch: {
    method: "PUT",
    path: "/branch/:branchID",
    summary: "Update branch details by ID",
    pathParams: z.object({
      branchID: z.string(),
    }),
    body: updateBranchSchema,
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  deleteBranch: {
    method: "DELETE",
    path: "/branch/:branchID",
    summary: "Delete a branch by ID",
    pathParams: z.object({
      branchID: z.string(),
    }),
    body: z.object({}),
    responses: {
      200: successSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
});
