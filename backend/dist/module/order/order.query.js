"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderQueryHandler = exports.getOrdersByDate = exports.getActiveOrderByTable = exports.getOrderByID = exports.getAllOrders = void 0;
const order_repository_1 = __importDefault(require("../../repository/order.repository"));
const mapOrder = (order) => {
    return {
        _id: order._id.toString(),
        orderNumber: order.orderNumber,
        tableId: order.tableId?._id?.toString?.() ||
            order.tableId?.toString?.() ||
            order.tableId,
        table: order.tableId,
        items: (order.items ?? []).map((item) => ({
            _id: item._id?.toString?.(),
            menuItemId: item.menuItemId?._id?.toString?.() ||
                item.menuItemId?.toString?.() ||
                item.menuItemId,
            menuItem: item.menuItemId?.name ?? item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.total ?? item.price * item.quantity,
        })),
        customerName: order.customerName,
        waiterId: order.waiterId?._id?.toString?.() ||
            order.waiterId?.toString?.() ||
            order.waiterId,
        waiter: order.waiterId,
        paymentStatus: order.paymentStatus,
        orderType: order.orderType,
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        notes: order.notes ?? "",
        status: order.status,
        ticketCount: order.ticketCount ?? 0,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    };
};
const getAllOrders = async ({ req }) => {
    try {
        console.log("[GET ALL ORDERS] QUERY:", req.query);
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit);
        const skip = (page - 1) * limit;
        const status = req.query.status;
        const tableId = req.query.tableId;
        const search = req.query.search;
        const to = req.query.to;
        const from = req.query.from;
        console.log("[GET ALL ORDERS] PARSED FILTERS:", {
            page,
            limit,
            skip,
            status,
            tableId,
            search,
            from,
            to,
        });
        console.log("[GET ALL ORDERS] FETCHING FROM DB...");
        const { data, total } = await order_repository_1.default.getAll({
            skip,
            limit,
            status,
            tableId,
            search,
            to,
            from,
        });
        console.log("[GET ALL ORDERS] DB RESULT:", {
            returned: data?.length,
            total,
        });
        const mapped = data.map(mapOrder);
        console.log("[GET ALL ORDERS] MAPPED ORDERS:", mapped.length);
        return {
            status: 200,
            body: {
                data: mapped,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        };
    }
    catch (error) {
        console.error("[GET ALL ORDERS] ERROR:", error);
        console.error("[GET ALL ORDERS] QUERY:", req.query);
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to fetch orders",
            },
        };
    }
};
exports.getAllOrders = getAllOrders;
const getOrderByID = async ({ req }) => {
    try {
        console.log("[GET ORDER BY ID] PARAMS:", req.params);
        const { orderID } = req.params;
        const order = await order_repository_1.default.getByID(orderID);
        console.log("[GET ORDER BY ID] DB RESULT:", order);
        if (!order) {
            console.log("[GET ORDER BY ID] NOT FOUND:", orderID);
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Order not found",
                },
            };
        }
        return {
            status: 200,
            body: mapOrder(order),
        };
    }
    catch (error) {
        console.error("[GET ORDER BY ID] ERROR:", error);
        console.error("[GET ORDER BY ID] PARAMS:", req.params);
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to fetch order",
            },
        };
    }
};
exports.getOrderByID = getOrderByID;
const getActiveOrderByTable = async ({ req }) => {
    try {
        console.log("[GET ACTIVE ORDER] PARAMS:", req.params);
        const { tableID } = req.params;
        const order = await order_repository_1.default.getActiveOrderByTable(tableID);
        console.log("[GET ACTIVE ORDER] RESULT:", order);
        if (!order) {
            console.log("[GET ACTIVE ORDER] NOT FOUND:", tableID);
            return {
                status: 404,
                body: {
                    success: false,
                    error: "No active order found for this table",
                },
            };
        }
        return {
            status: 200,
            body: {
                _id: order._id.toString(),
                orderNumber: order.orderNumber,
                tableId: order.tableId.toString(),
                customerName: order.customerName,
                waiterId: order.waiterId.toString(),
                notes: order.notes,
                items: order.items.map((item) => ({
                    menuItemId: item.menuItemId.toString(),
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    total: item.total,
                })),
                subtotal: order.subtotal,
                tax: order.tax,
                total: order.total,
                ticketCount: order.ticketCount,
                status: order.status,
                paymentStatus: order.paymentStatus,
                createdAt: order.createdAt,
            },
        };
    }
    catch (error) {
        console.error("[GET ACTIVE ORDER] ERROR:", error);
        console.error("[GET ACTIVE ORDER] PARAMS:", req.params);
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.getActiveOrderByTable = getActiveOrderByTable;
const getOrdersByDate = async ({ req }) => {
    try {
        console.log("[GET ORDERS BY DATE] QUERY:", req.query);
        const { dateReport } = req.query;
        if (!dateReport) {
            console.log("[GET ORDERS BY DATE] MISSING DATE");
            return {
                status: 400,
                body: {
                    success: false,
                    error: "Date is required",
                },
            };
        }
        console.log("[GET ORDERS BY DATE] FETCHING FOR DATE:", dateReport);
        const orders = await order_repository_1.default.getOrdersByDate(dateReport);
        console.log("[GET ORDERS BY DATE] RESULT COUNT:", orders.length);
        const data = orders.map(mapOrder);
        return {
            status: 200,
            body: {
                success: true,
                data,
            },
        };
    }
    catch (error) {
        console.error("[GET ORDERS BY DATE] ERROR:", error);
        console.error("[GET ORDERS BY DATE] QUERY:", req.query);
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.getOrdersByDate = getOrdersByDate;
exports.orderQueryHandler = {
    getAllOrders: exports.getAllOrders,
    getOrderByID: exports.getOrderByID,
    getActiveOrderByTable: exports.getActiveOrderByTable,
    getOrdersByDate: exports.getOrdersByDate,
};
