"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderMutationHandler = exports.removeOrder = exports.updatePaymentStatus = void 0;
const order_repository_1 = __importDefault(require("../../repository/order.repository"));
const ticket_repository_1 = __importDefault(require("../../repository/ticket.repository"));
const table_model_1 = __importDefault(require("../../model/table.model"));
const menu_item_model_1 = __importDefault(require("../../model/menu-item.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const createOrder = async ({ req }) => {
    try {
        const { tableId, customerName, waiterId, notes, items } = req.body;
        let order = await order_repository_1.default.getActiveOrderByTable(tableId);
        let isReorder = false;
        const resolvedItems = [];
        for (const item of items) {
            const menuItem = await menu_item_model_1.default.findById(item.menuItemId);
            if (!menuItem) {
                return {
                    status: 400,
                    body: {
                        success: false,
                        error: `Menu item not found: ${item.menuItemId}`,
                    },
                };
            }
            resolvedItems.push({
                menuItemId: menuItem._id,
                name: menuItem.name,
                price: menuItem.price,
                quantity: item.quantity,
                total: menuItem.price * item.quantity,
            });
        }
        const subtotal = resolvedItems.reduce((sum, i) => sum + i.total, 0);
        const tax = Number((subtotal * 0.13).toFixed(2));
        const total = subtotal + tax;
        if (!order) {
            const orderNumber = await order_repository_1.default.generateOrderNumber();
            order = await order_repository_1.default.create({
                orderNumber,
                tableId: new mongoose_1.default.Types.ObjectId(tableId),
                customerName: customerName || "Guest",
                waiterId: new mongoose_1.default.Types.ObjectId(waiterId),
                notes,
                items: resolvedItems,
                subtotal,
                tax,
                total,
                ticketCount: 1,
                status: "active",
                paymentStatus: "pending",
            });
            await ticket_repository_1.default.create({
                orderId: order._id,
                tableId: new mongoose_1.default.Types.ObjectId(tableId),
                ticketNumber: 1,
                items: resolvedItems.map((i) => ({
                    menuItemId: i.menuItemId,
                    name: i.name,
                    quantity: i.quantity,
                    price: i.price,
                })),
                printed: false,
                status: "pending",
            });
            await table_model_1.default.findByIdAndUpdate(new mongoose_1.default.Types.ObjectId(tableId), {
                status: "occupied",
            });
            return {
                status: 201,
                body: {
                    success: true,
                    message: "Order created successfully",
                    data: order,
                },
            };
        }
        isReorder = true;
        for (const newItem of resolvedItems) {
            const existingItem = order.items.find((i) => i.menuItemId.toString() === newItem.menuItemId.toString());
            if (existingItem) {
                existingItem.quantity += newItem.quantity;
                existingItem.total = existingItem.quantity * existingItem.price;
            }
            else {
                order.items.push(newItem);
            }
        }
        order.subtotal += subtotal;
        order.tax += tax;
        order.total += total;
        order.ticketCount += 1;
        await order.save();
        await ticket_repository_1.default.create({
            orderId: order._id,
            tableId: new mongoose_1.default.Types.ObjectId(tableId),
            ticketNumber: order.ticketCount,
            items: resolvedItems.map((i) => ({
                menuItemId: i.menuItemId,
                name: i.name,
                quantity: i.quantity,
                price: i.price,
            })),
            printed: false,
            status: "pending",
        });
        return {
            status: 200,
            body: {
                success: true,
                message: "Order updated (reorder)",
                data: order,
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
const updatePaymentStatus = async ({ req }) => {
    try {
        const { orderID } = req.params;
        const { status, paymentStatus } = req.body;
        const Payment = await order_repository_1.default.getByID(orderID);
        if (!Payment) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Payment not found",
                },
            };
        }
        const updated = await order_repository_1.default.updateStatus(orderID, status, paymentStatus);
        return {
            status: 200,
            body: {
                success: true,
                message: "Payment updated",
                data: updated,
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
exports.updatePaymentStatus = updatePaymentStatus;
const removeOrder = async ({ req }) => {
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
        const deletedOrder = await order_repository_1.default.delete(orderID);
        if (deletedOrder) {
            await ticket_repository_1.default.deleteByOrderId(orderID);
        }
        return {
            status: 200,
            body: {
                success: true,
                message: "Order cancelled",
            },
        };
    }
    catch (error) {
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to delete order",
            },
        };
    }
};
exports.removeOrder = removeOrder;
exports.orderMutationHandler = {
    createOrder,
    updatePaymentStatus: exports.updatePaymentStatus,
    removeOrder: exports.removeOrder,
};
