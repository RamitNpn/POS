"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderQueryHandler = exports.getActiveOrderByTable = exports.getOrderByID = exports.getAllOrders = void 0;
const order_repository_1 = __importDefault(require("../../repository/order.repository"));
const mapOrder = (order) => {
    return {
        _id: order._id.toString(),
        orderNumber: order.orderNumber,
        tableId: order.tableId?._id?.toString?.() || order.tableId,
        table: order.tableId,
        items: (order.items ?? []).map((item) => ({
            _id: item._id?.toString(),
            menuItemId: item.menuItemId?._id?.toString?.() ||
                item.menuItemId?.toString?.() ||
                item.menuItemId,
            menuItem: item.name,
            quantity: item.quantity,
            notes: item.notes ?? "",
            price: item.price,
            total: item.total ?? item.price * item.quantity,
        })),
        customerName: order.customerName,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        subtotal: order.subtotal,
        tax: order.tax,
        discount: order.discount ?? 0,
        serviceCharge: order.serviceCharge ?? 0,
        total: order.total,
        notes: order.notes ?? "",
        waiterId: order.waiterId?._id?.toString?.() || order.waiterId,
        waiter: order.waiterId,
        status: order.status,
        ticketCount: order.ticketCount ?? 0,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    };
};
const getAllOrders = async ({ req }) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit);
        const skip = (page - 1) * limit;
        const status = req.query.status;
        const tableId = req.query.tableId;
        const search = req.query.search;
        const { data, total } = await order_repository_1.default.getAll({
            skip,
            limit,
            status,
            tableId,
            search,
        });
        return {
            status: 200,
            body: {
                data: data.map(mapOrder),
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
        const { orderID } = req.params;
        const order = await order_repository_1.default.getByID(orderID);
        if (!order) {
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
        const { tableID } = req.params;
        const order = await order_repository_1.default.getActiveOrderByTable(tableID);
        if (!order) {
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
exports.orderQueryHandler = {
    getAllOrders: exports.getAllOrders,
    getOrderByID: exports.getOrderByID,
    getActiveOrderByTable: exports.getActiveOrderByTable,
};
