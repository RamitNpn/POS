"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketRouter = void 0;
const express_1 = require("@ts-rest/express");
const ticket_contract_1 = require("../../contract/ticket/ticket.contract");
const ticket_mutation_1 = require("./ticket.mutation");
const ticket_query_1 = require("./ticket.query");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const s = (0, express_1.initServer)();
exports.ticketRouter = s.router(ticket_contract_1.ticketContract, {
    updateTicketStatus: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("cashier", "waiter", "admin")],
        handler: ticket_mutation_1.ticketMutationHandler.updateTicketStatus,
    },
    removeTicket: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: ticket_mutation_1.ticketMutationHandler.removeTicket,
    },
    getAllTickets: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("cashier", "admin", "waiter")],
        handler: ticket_query_1.ticketQueryHandler.getAllTickets,
    },
    getTicketByID: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("cashier", "admin", "waiter")],
        handler: ticket_query_1.ticketQueryHandler.getTicketById,
    },
    getLiveTickets: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("cashier", "admin", "waiter")],
        handler: ticket_query_1.ticketQueryHandler.getLiveTickets,
    },
    getTicketsByOrder: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("cashier", "admin", "waiter")],
        handler: ticket_query_1.ticketQueryHandler.getTicketsByOrder,
    },
});
