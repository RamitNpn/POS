import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  kitchenTicketSchema,
  getKitchenTicketByIdSchema,
  getAllKitchenTicketsSchema,
  updateKitchenTicketSchema,
} from "./ticket.schema";
import { successSchema, errorSchema } from "../commonSchema";

const c = initContract();

export const ticketContract = c.router({
  getLiveTickets: {
    method: "GET",
    path: "/kitchen-ticket",
    responses: {
      200: z.object({
        data: z.array(kitchenTicketSchema),
      }),
      500: errorSchema,
    },
  },
  getTicketByID: {
    method: "GET",
    path: "/kitchen-ticket/:ticketID",
    pathParams: z.object({
      ticketID: z.string(),
    }),
    responses: {
      200: getKitchenTicketByIdSchema,
      404: errorSchema,
    },
  },

  getTicketsByOrder: {
    method: "GET",
    path: "/kitchen-ticket/order/:orderID",
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
    path: "/kitchen-ticket/:ticketID",
    pathParams: z.object({
      ticketID: z.string(),
    }),
    body: updateKitchenTicketSchema,
    responses: {
      200: successSchema,
      404: errorSchema,
    },
  },

  removeTicket: {
    method: "DELETE",
    path: "/kitchen-ticket/:ticketID",
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
