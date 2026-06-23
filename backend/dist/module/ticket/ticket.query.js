"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketQueryHandler = exports.getTicketsByOrder = exports.getTicketById = exports.getLiveTickets = exports.getAllTickets = void 0;
const ticket_repository_1 = __importDefault(require("../../repository/ticket.repository"));
const mapTicket = (ticket) => {
    const order = ticket.orderId;
    const table = ticket.tableId;
    return {
        _id: ticket._id?.toString?.(),
        ticketNumber: ticket.ticketNumber,
        status: ticket.status,
        printed: ticket.printed,
        createdAt: ticket.createdAt,
        orderId: order?._id?.toString?.() || ticket.orderId?.toString?.(),
        orderNumber: order?.orderNumber || null,
        customerName: order?.customerName || "Guest",
        waiter: {
            waiterId: order?.waiterId?._id?.toString?.() || order?.waiterId?.toString?.(),
            name: order?.waiterId?.name || null,
        },
        table: {
            tableId: table?._id?.toString?.() || ticket.tableId?.toString?.(),
            tableName: table?.name || null,
            capacity: table?.capacity || null,
            status: table?.status || null,
        },
        items: (ticket.items ?? []).map((i) => ({
            menuItemId: i.menuItemId?._id?.toString?.() || i.menuItemId?.toString?.(),
            name: i.name,
            quantity: i.quantity,
            price: i.price,
        })),
    };
};
const getAllTickets = async (req) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit);
        const search = req.query.search;
        const status = req.query.status;
        if (status && status !== "all") {
            req.query.status = status;
        }
        const tickets = await ticket_repository_1.default.getAll({
            skip: 0,
            limit,
            status: status,
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
exports.getAllTickets = getAllTickets;
const getLiveTickets = async (req) => {
    try {
        const search = req.query.search;
        const tickets = await ticket_repository_1.default.getLatestTickets({
            skip: 0,
            limit: 100,
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
        console.error("LIVE TICKETS ERROR:", error);
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.getLiveTickets = getLiveTickets;
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
    getAllTickets: exports.getAllTickets,
    getTicketById: exports.getTicketById,
    getLiveTickets: exports.getLiveTickets,
    getTicketsByOrder: exports.getTicketsByOrder,
};
