"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketQueryHandler = exports.getTicketsByOrder = exports.getLiveTickets = exports.getTicketById = void 0;
const ticket_repository_1 = __importDefault(require("../../repository/ticket.repository"));
const mapTicket = (ticket) => {
    const order = ticket.orderId;
    const table = ticket.tableId;
    return {
        // Ticket
        _id: ticket._id?.toString?.(),
        ticketNumber: ticket.ticketNumber,
        status: ticket.status,
        printed: ticket.printed,
        createdAt: ticket.createdAt,
        // Order (populated)
        orderId: order?._id?.toString?.() || ticket.orderId?.toString?.(),
        orderNumber: order?.orderNumber || null,
        customerName: order?.customerName || "Guest",
        waiter: {
            waiterId: order?.waiterId?._id?.toString?.() || order?.waiterId?.toString?.(),
            name: order?.waiterId?.name || null,
        },
        // Table (populated)
        table: {
            tableId: table?._id?.toString?.() || ticket.tableId?.toString?.(),
            tableName: table?.name || null,
            capacity: table?.capacity || null,
            status: table?.status || null,
        },
        // Items (kitchen view + finance usable)
        items: (ticket.items ?? []).map((i) => ({
            menuItemId: i.menuItemId?._id?.toString?.() || i.menuItemId?.toString?.(),
            name: i.name,
            quantity: i.quantity,
        })),
    };
};
const getTicketById = async ({ req }) => {
    try {
        const { ticketID } = req.params;
        const ticket = await ticket_repository_1.default.getByID(ticketID);
        if (!ticket) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Ticket not found",
                },
            };
        }
        return {
            status: 200,
            body: mapTicket(ticket),
        };
    }
    catch (error) {
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to fetch ticket",
            },
        };
    }
};
exports.getTicketById = getTicketById;
const getLiveTickets = async (req) => {
    try {
        const search = req.query.search;
        const tickets = await ticket_repository_1.default.getAll({
            skip: 0,
            limit: 100,
            status: "pending",
            search,
        });
        return {
            status: 200,
            body: {
                data: tickets.data.map(mapTicket),
            },
        };
    }
    catch (error) {
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to fetch tickets",
            },
        };
    }
};
exports.getLiveTickets = getLiveTickets;
const getTicketsByOrder = async ({ req }) => {
    try {
        const { orderID } = req.params;
        const tickets = await ticket_repository_1.default.getByOrderID(orderID);
        if (!tickets || tickets.length === 0) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "No tickets found for this order",
                },
            };
        }
        return {
            status: 200,
            body: {
                data: tickets.map(mapTicket),
            },
        };
    }
    catch (error) {
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to fetch tickets",
            },
        };
    }
};
exports.getTicketsByOrder = getTicketsByOrder;
exports.ticketQueryHandler = {
    getTicketById: exports.getTicketById,
    getLiveTickets: exports.getLiveTickets,
    getTicketsByOrder: exports.getTicketsByOrder,
};
