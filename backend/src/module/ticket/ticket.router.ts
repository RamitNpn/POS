import { initServer } from "@ts-rest/express";

import { ticketContract } from "../../contract/ticket/ticket.contract";
import { ticketMutationHandler } from "./ticket.mutation";
import { ticketQueryHandler } from "./ticket.query";

import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware";

const s = initServer();

export const ticketRouter = s.router(ticketContract, {
  updateTicketStatus: {
    middleware: [verifyToken, authorizeRoles("cashier", "waiter", "admin")],
    handler: ticketMutationHandler.updateTicketStatus,
  },

  removeTicket: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: ticketMutationHandler.removeTicket as any,
  },

  getAllTickets: {
    middleware: [verifyToken, authorizeRoles("cashier", "admin", "waiter")],
    handler: ticketQueryHandler.getAllTickets,
  },

  getTicketByID: {
    middleware: [verifyToken, authorizeRoles("cashier", "admin", "waiter")],
    handler: ticketQueryHandler.getTicketById,
  },

  getLiveTickets: {
    middleware: [verifyToken, authorizeRoles("cashier", "admin", "waiter")],
    handler: ticketQueryHandler.getLiveTickets,
  },

  getTicketsByOrder: {
    middleware: [verifyToken, authorizeRoles("cashier", "admin", "waiter")],
    handler: ticketQueryHandler.getTicketsByOrder,
  },
});
