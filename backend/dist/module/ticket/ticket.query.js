"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketQueryHandler = exports.getTicketsByOrder = exports.getTicketByTableId = exports.getTicketById = exports.getLiveTickets = exports.getAllTickets = void 0;
const ticket_repository_1 = __importDefault(require("../../repository/ticket.repository"));
const mapTicket = (ticket) => {
    console.log("[mapTicket] raw ticket:", {
        id: ticket?._id,
        ticketNumber: ticket?.ticketNumber,
        status: ticket?.status,
        orderId: ticket?.orderId,
        tableId: ticket?.tableId,
        itemCount: ticket?.items?.length ?? 0,
    });
    const order = ticket.orderId;
    const table = ticket.tableId;
    const mapped = {
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
    console.log("[mapTicket] mapped ticket:", {
        id: mapped._id,
        ticketNumber: mapped.ticketNumber,
        status: mapped.status,
        orderNumber: mapped.orderNumber,
        tableName: mapped.table.tableName,
        itemCount: mapped.items.length,
    });
    return mapped;
};
const getAllTickets = async (req) => {
    try {
        console.log("[getAllTickets] query:", req.query);
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit);
        const search = req.query.search;
        const status = req.query.status;
        console.log("[getAllTickets] filters:", {
            page,
            limit,
            search,
            status,
        });
        if (status && status !== "all") {
            req.query.status = status;
        }
        const tickets = await ticket_repository_1.default.getAll({
            skip: 0,
            limit,
            status,
            search,
        });
        console.log("[getAllTickets] repository result:", {
            totalRecords: tickets.data.length,
            sample: tickets.data[0],
        });
        return {
            status: 200,
            body: {
                data: tickets.data.map(mapTicket),
            },
        };
    }
    catch (error) {
        console.error("[getAllTickets] error:", error);
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
        console.log("[getLiveTickets] query:", req.query);
        const search = req.query.search;
        const status = req.query.status;
        const tickets = await ticket_repository_1.default.getLatestTickets({
            skip: 0,
            limit: 100,
            search,
            status,
        });
        console.log("[getLiveTickets] repository result:", {
            totalRecords: tickets.data.length,
            sample: tickets.data[0],
        });
        return {
            status: 200,
            body: {
                data: tickets.data.map(mapTicket),
            },
        };
    }
    catch (error) {
        console.error("[getLiveTickets] error:", error);
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
        console.log("[getTicketById] ticketID:", ticketID);
        const ticket = await ticket_repository_1.default.getByID(ticketID);
        console.log("[getTicketById] ticket:", ticket);
        if (!ticket) {
            console.log("[getTicketById] ticket not found");
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
        console.error("[getTicketById] error:", error);
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
const getTicketByTableId = async ({ req }) => {
    try {
        const { tableID } = req.params;
        console.log("[getTicketById] tableID:", tableID);
        const ticket = await ticket_repository_1.default.getByTableID(tableID);
        console.log("[getTicketById] ticket:", ticket);
        if (!ticket) {
            console.log("[getTicketById] ticket not found");
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
            body: {
                data: ticket.map(mapTicket),
            },
        };
    }
    catch (error) {
        console.error("[getTicketById] error:", error);
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to fetch ticket",
            },
        };
    }
};
exports.getTicketByTableId = getTicketByTableId;
const getTicketsByOrder = async ({ req }) => {
    try {
        const { orderID } = req.params;
        console.log("[getTicketsByOrder] orderID:", orderID);
        const tickets = await ticket_repository_1.default.getByOrderID(orderID);
        console.log("[getTicketsByOrder] tickets found:", tickets?.length ?? 0);
        if (!tickets || tickets.length === 0) {
            console.log("[getTicketsByOrder] no tickets found");
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
        console.error("[getTicketsByOrder] error:", error);
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
    getTicketByTableId: exports.getTicketByTableId,
};
