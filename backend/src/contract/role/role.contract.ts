import { initContract } from "@ts-rest/core";
import { z } from "zod";

import { errorSchema, successSchema } from "../commonSchema";
import { createRoleSchema, getAllRolesSchema, getRoleByIdSchema, updateRoleSchema } from "./role.schema";

const c = initContract();

export const roleContract = c.router({
  createRole: {
    method: "POST",
    path: "/role",
    summary: "Create a new role",
    body: createRoleSchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllRoles: {
    method: "GET",
    path: "/role",
    summary: "Get a paginated list of roles with optional search",
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      search: z.string().optional(),
    }),
    responses: {
      200: z.object({
        data: getAllRolesSchema,
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

  getRoleByID: {
    method: "GET",
    path: "/role/:roleID",
    summary: "Get role details by ID",
    pathParams: z.object({
      roleID: z.string(),
    }),
    responses: {
      200: getRoleByIdSchema,
      404: errorSchema,
    },
  },

  updateRole: {
    method: "PUT",
    path: "/role/:roleID",
    summary: "Update role details by ID",
    pathParams: z.object({
      roleID: z.string(),
    }),
    body: updateRoleSchema,
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  removeRole: {
    method: "DELETE",
    path: "/role/:roleID",
    summary: "Remove a role by ID",
    pathParams: z.object({
      roleID: z.string(),
    }),
    body: z.object({}),
    responses: {
      200: successSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
});