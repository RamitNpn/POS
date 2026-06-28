"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketMutationHandler = exports.removeTicket = exports.updateTicketStatus = exports.updateTicketItems = void 0;
const ticket_repository_1 = __importDefault(require("../../repository/ticket.repository"));
const log_repository_1 = __importDefault(require("../../repository/log.repository"));
const mongoose_1 = __importDefault(require("mongoose"));
const updateTicketItems = async ({ req }) => {
    try {
        const { ticketID } = req.params;
        const { items } = req.body;
        console.log("[updateTicketItems]", {
            ticketID,
            itemCount: items.length,
        });
        const existing = await ticket_repository_1.default.getByID(ticketID);
        console.log("[updateTicketStatus] existing ticket:", existing);
        if (!existing) {
            console.log("[updateTicketStatus] ticket not found");
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Ticket not found",
                },
            };
        }
        const ticket = await ticket_repository_1.default.updateTicketItems(ticketID, items);
        if (!ticket) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Ticket not found",
                },
            };
        }
        const order = existing.orderId;
        const log = await log_repository_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(req.user?.id),
            action: "Update",
            details: `Items updated in Order ${order.orderNumber} Ticket ${existing.ticketNumber} at ${new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kathmandu",
            })}`,
            module: "Ticket",
            entityId: `${ticketID}`,
            entityType: "",
        });
        if (!log) {
            console.log("User log not created", log);
        }
        return {
            status: 200,
            body: {
                success: true,
                message: "Ticket updated successfully.",
            },
        };
    }
    catch (error) {
        console.error("[updateTicketItems]", error);
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to update ticket.",
            },
        };
    }
};
exports.updateTicketItems = updateTicketItems;
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
        const order = ticket.orderId;
        const log = await log_repository_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(req.user?.id),
            action: "Update",
            details: `Ticket status updated in Order ${order.orderNumber} Ticket ${ticket.ticketNumber} at ${new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kathmandu",
            })}`,
            module: "Ticket",
            entityId: `${ticketID}`,
            entityType: "",
        });
        if (!log) {
            console.log("User log not created", log);
        }
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
        const order = ticket.orderId;
        const log = await log_repository_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(req.user?.id),
            action: "Delete",
            details: `Ticket ${ticket.ticketNumber}cancelled in Order ${order.orderNumber} at ${new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kathmandu",
            })}`,
            module: "Ticket",
            entityId: `${ticketID}`,
            entityType: "",
        });
        if (!log) {
            console.log("User log not created", log);
        }
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
    updateTicketItems: exports.updateTicketItems,
    updateTicketStatus: exports.updateTicketStatus,
    removeTicket: exports.removeTicket,
};
