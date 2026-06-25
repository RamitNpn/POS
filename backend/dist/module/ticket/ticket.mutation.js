"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketMutationHandler = exports.removeTicket = exports.updateTicketStatus = void 0;
const ticket_repository_1 = __importDefault(require("../../repository/ticket.repository"));
const updateTicketStatus = async ({ req }) => {
    try {
        const { ticketID } = req.params;
        const { status } = req.body;
        console.log("[updateTicketStatus] ticketID:", ticketID);
        console.log("[updateTicketStatus] requested status:", status);
        const ticket = await ticket_repository_1.default.getByID(ticketID);
        console.log("[updateTicketStatus] existing ticket:", ticket);
        if (!ticket) {
            console.log("[updateTicketStatus] ticket not found");
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Ticket not found",
                },
            };
        }
        console.log("[updateTicketStatus] current status:", ticket.status);
        const updated = await ticket_repository_1.default.updateStatus(ticketID, status);
        console.log("[updateTicketStatus] updated ticket:", updated);
        return {
            status: 200,
            body: {
                success: true,
                message: "Ticket updated",
                data: updated,
            },
        };
    }
    catch (error) {
        console.error("[updateTicketStatus] error:", error);
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.updateTicketStatus = updateTicketStatus;
const removeTicket = async ({ req }) => {
    try {
        const { ticketID } = req.params;
        console.log("[removeTicket] ticketID:", ticketID);
        const ticket = await ticket_repository_1.default.getByID(ticketID);
        console.log("[removeTicket] existing ticket:", ticket);
        if (!ticket) {
            console.log("[removeTicket] ticket not found");
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Ticket not found",
                },
            };
        }
        console.log("[removeTicket] current status:", ticket.status);
        const cancelled = await ticket_repository_1.default.updateStatus(ticketID, "cancelled");
        console.log("[removeTicket] cancelled ticket:", cancelled);
        return {
            status: 200,
            body: {
                success: true,
                message: "Ticket cancelled",
            },
        };
    }
    catch (error) {
        console.error("[removeTicket] error:", error);
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to delete ticket",
            },
        };
    }
};
exports.removeTicket = removeTicket;
exports.ticketMutationHandler = {
    updateTicketStatus: exports.updateTicketStatus,
    removeTicket: exports.removeTicket,
};
