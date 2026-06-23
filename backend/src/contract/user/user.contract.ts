import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  createUserSchema,
  getAllUsersSchema,
  getUserByIdSchema,
} from "./user.schema";
import { errorSchema, successSchema } from "../commonSchema";

const c = initContract();

export const userContract = c.router({
  createUser: {
    method: "POST",
    path: "/user",
    summary: "Create a new user",
    body: createUserSchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllUsers: {
    method: "GET",
    path: "/user",
    summary: "Get a paginated list of users with optional search and role filtering",
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      search: z.string().optional(),
      role: z.string().optional(),
    }),
    responses: {
      200: z.object({
        data: getAllUsersSchema,
      }),
      500: errorSchema,
    },
  },

  getUserByID: {
    method: "GET",
    path: "/user/:userID",
    summary: "Get user details by ID",
    pathParams: z.object({
      userID: z.string().min(1),
    }),
    responses: {
      200: getUserByIdSchema,
      404: errorSchema,
    },
  },

  updateUser: {
    method: "PUT",
    path: "/user/:userID",
    summary: "Update user details by ID",
    pathParams: z.object({
      userID: z.string().min(1),
    }),
    body: z.any(),
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
    },
  },

  removeUser: {
    method: "DELETE",
    path: "/user/:userID",
    summary: "Delete a user by ID",
    pathParams: z.object({
      userID: z.string(),
    }),
    body: c.noBody(),
    responses: {
      200: successSchema,
      404: errorSchema,
    },
  },
});
