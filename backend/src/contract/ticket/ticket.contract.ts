import { initContract } from "@ts-rest/core";
import { z } from "zod";

import {
  kitchenTicketSchema,
  getKitchenTicketByIdSchema,
  getAllKitchenTicketsSchema,
  updateKitchenTicketSchema,
  getKitchenTicketBytableIdSchema,
  updateKitchenTicketItemsSchema,
} from "./ticket.schema";

import { successSchema, errorSchema } from "../commonSchema";

const c = initContract();

export const ticketContract = c.router({
  getAllTickets: {
    method: "GET",
    path: "/ticket",
    summary: "Get all kitchen tickets",
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      search: z.string().optional(),
      status: z.string().optional(),
    }),
    responses: {
      200: z.object({
        data: z.array(kitchenTicketSchema),
      }),
      500: errorSchema,
    },
  },

  getLiveTickets: {
    method: "GET",
    path: "/ticket/active-tickets",
    summary: "Get all live kitchen tickets",
    query: z.object({
      search: z.string().optional(),
    }),
    responses: {
      200: z.object({
        data: z.array(kitchenTicketSchema),
      }),
      500: errorSchema,
    },
  },

  getTicketByID: {
    method: "GET",
    path: "/ticket/:ticketID",
    summary: "Get kitchen ticket by ID",
    pathParams: z.object({
      ticketID: z.string(),
    }),
    responses: {
      200: getKitchenTicketByIdSchema,
      404: errorSchema,
    },
  },

  getTicketByTableID: {
    method: "GET",
    path: "/ticket/table/:tableID",
    summary: "Get kitchen ticket by table ID",
    pathParams: z.object({
      tableID: z.string(),
    }),
    responses: {
      200: z.object({
        data: getKitchenTicketBytableIdSchema,
      }),
      404: errorSchema,
    },
  },

  getTicketsByOrder: {
    method: "GET",
    path: "/ticket/order/:orderID",
    summary: "Get all kitchen tickets for a specific order",
    pathParams: z.object({
      orderID: z.string(),
    }),
    responses: {
      200: z.object({
        data: getAllKitchenTicketsSchema,
      }),
      404: errorSchema,
    },
  },

  updateTicketStatus: {
    method: "PUT",
    path: "/ticket/:ticketID",
    summary: "Update kitchen ticket status",
    pathParams: z.object({
      ticketID: z.string(),
    }),
    body: updateKitchenTicketSchema,
    responses: {
      200: successSchema,
      404: errorSchema,
    },
  },

  updateTicketItems: {
    method: "PUT",
    path: "/ticket/update/:ticketID",
    summary: "Update ticket items",
    pathParams: z.object({
      ticketID: z.string(),
    }),
    body: updateKitchenTicketItemsSchema,
    responses: {
      200: successSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  removeTicket: {
    method: "DELETE",
    path: "/ticket/:ticketID",
    summary: "Delete a kitchen ticket",
    pathParams: z.object({
      ticketID: z.string(),
    }),
    body: z.object({}),
    responses: {
      200: successSchema,
      404: errorSchema,
    },
  },
});
