import { initContract } from "@ts-rest/core";
import { z } from "zod";

import {
  createRoomSchema,
  getAllRoomsSchema,
  getRoomByIdSchema,
  updateRoomSchema,
} from "./room.schema";

import { errorSchema, successSchema } from "../commonSchema";

const c = initContract();

export const roomContract = c.router({
  createRoom: {
    method: "POST",
    path: "/room",
    summary: "Create a new room",
    body: createRoomSchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllRooms: {
    method: "GET",
    path: "/room",
    summary: "Get a paginated list of rooms with optional search",
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      search: z.string().optional(),
    }),
    responses: {
      200: z.object({
        data: getAllRoomsSchema,
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

  getRoomByID: {
    method: "GET",
    path: "/room/:roomID",
    summary: "Get room details by ID",
    pathParams: z.object({
      roomID: z.string(),
    }),
    responses: {
      200: getRoomByIdSchema,
      404: errorSchema,
    },
  },

  updateRoom: {
    method: "PUT",
    path: "/room/:roomID",
    summary: "Update room details by ID",
    pathParams: z.object({
      roomID: z.string(),
    }),
    body: updateRoomSchema,
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  removeRoom: {
    method: "DELETE",
    path: "/room/:roomID",
    summary: "Remove a room by ID",
    pathParams: z.object({
      roomID: z.string(),
    }),
    body: z.object({}),
    responses: {
      200: successSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
});