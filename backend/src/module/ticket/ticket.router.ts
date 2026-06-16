import { initServer } from "@ts-rest/express";

import { ticketContract } from "../../contract/ticket/ticket.contract";
import { ticketMutationHandler } from "./ticket.mutation";
import { ticketQueryHandler } from "./ticket.query";

const s = initServer();

export const ticketRouter = s.router(ticketContract, {
  updateTicketStatus: ticketMutationHandler.updateTicketStatus,
  removeTicket: ticketMutationHandler.removeTicket,

  getTicketByID: ticketQueryHandler.getTicketById,
  getLiveTickets: ticketQueryHandler.getLiveTickets,
  getTicketsByOrder: ticketQueryHandler.getTicketsByOrder,
});
