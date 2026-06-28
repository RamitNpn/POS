import { initServer } from "@ts-rest/express";

import { ticketContract } from "../../contract/ticket/ticket.contract";
import { ticketMutationHandler } from "./ticket.mutation";
import { ticketQueryHandler } from "./ticket.query";

import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware";

const s = initServer();

export const ticketRouter = s.router(ticketContract, {
  getAllTickets: {
    middleware: [verifyToken, authorizeRoles("cashier", "admin", "waiter")],
    handler: ticketQueryHandler.getAllTickets,
  },

  getLiveTickets: {
    middleware: [verifyToken, authorizeRoles("cashier", "admin", "waiter")],
    handler: ticketQueryHandler.getLiveTickets,
  },

  getTicketByID: {
    middleware: [verifyToken, authorizeRoles("cashier", "admin", "waiter")],
    handler: ticketQueryHandler.getTicketById,
  },

  getTicketByTableID: {
    middleware: [verifyToken, authorizeRoles("cashier", "admin", "waiter")],
    handler: ticketQueryHandler.getTicketByTableId,
  },

  getTicketsByOrder: {
    middleware: [verifyToken, authorizeRoles("cashier", "admin", "waiter")],
    handler: ticketQueryHandler.getTicketsByOrder,
  },

  updateTicketStatus: {
    middleware: [verifyToken, authorizeRoles("cashier", "waiter", "admin")],
    handler: ticketMutationHandler.updateTicketStatus,
  },

  updateTicketItems: {
    middleware: [verifyToken, authorizeRoles("cashier", "waiter", "admin")],
    handler: ticketMutationHandler.updateTicketItems,
  },

  removeTicket: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: ticketMutationHandler.removeTicket as any,
  },
});
