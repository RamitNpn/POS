import { initContract } from "@ts-rest/core";
import { z } from "zod";

import { errorSchema } from "../commonSchema";
import { getMeResponseSchema, loginResponseSchema, loginSchema, logoutResponseSchema } from "./auth.schema";

const c = initContract();

export const authContract = c.router({
  login: {
    method: "POST",
    path: "/auth/login",
    summary: "Authenticate a user and return user profile",
    body: loginSchema,
    responses: {
      200: loginResponseSchema,
      400: errorSchema,
      401: errorSchema,
      403: errorSchema,
      500: errorSchema,
    },
  },

  logout: {
    method: "POST",
    path: "/auth/logout",
    summary: "Clear authentication session",
    body: z.object({
    }),
    responses: {
      200: logoutResponseSchema,
      500: errorSchema,
    },
  },

  getMe: {
    method: "GET",
    path: "/auth/me",
    summary: "Get the authenticated user profile",
    responses: {
      200: getMeResponseSchema,
      401: errorSchema,
      500: errorSchema,
    },
  },
});