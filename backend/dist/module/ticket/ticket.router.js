"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketRouter = void 0;
const express_1 = require("@ts-rest/express");
const ticket_contract_1 = require("../../contract/ticket/ticket.contract");
const ticket_mutation_1 = require("./ticket.mutation");
const ticket_query_1 = require("./ticket.query");
const s = (0, express_1.initServer)();
exports.ticketRouter = s.router(ticket_contract_1.ticketContract, {
    updateTicketStatus: ticket_mutation_1.ticketMutationHandler.updateTicketStatus,
    removeTicket: ticket_mutation_1.ticketMutationHandler.removeTicket,
    getTicketByID: ticket_query_1.ticketQueryHandler.getTicketById,
    getLiveTickets: ticket_query_1.ticketQueryHandler.getLiveTickets,
    getTicketsByOrder: ticket_query_1.ticketQueryHandler.getTicketsByOrder,
});
