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
        console.log("[CREATE ORDER] REQUEST BODY:", req.body);
        const { tableId, customerName, waiterId, notes, items } = req.body;
        console.log("[CREATE ORDER] TABLE:", tableId);
        console.log("[CREATE ORDER] ITEMS COUNT:", items?.length);
        let order = await order_repository_1.default.getActiveOrderByTable(tableId);
        console.log("[CREATE ORDER] EXISTING ACTIVE ORDER:", order?._id || null);
        let isReorder = false;
        const resolvedItems = [];
        for (const item of items) {
            console.log("[CREATE ORDER] RESOLVING ITEM:", item.menuItemId);
            const menuItem = await menu_item_model_1.default.findById(item.menuItemId);
            if (!menuItem) {
                console.log("[CREATE ORDER] MENU ITEM NOT FOUND:", item.menuItemId);
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
            console.log("[CREATE ORDER] ITEM RESOLVED:", {
                name: menuItem.name,
                price: menuItem.price,
                quantity: item.quantity,
            });
        }
        const subtotal = resolvedItems.reduce((sum, i) => sum + i.total, 0);
        const tax = Number((subtotal * 0.13).toFixed(2));
        const total = subtotal + tax;
        console.log("[CREATE ORDER] PRICING:", {
            subtotal,
            tax,
            total,
        });
        if (!order) {
            console.log("[CREATE ORDER] CREATING NEW ORDER");
            const orderNumber = await order_repository_1.default.generateOrderNumber();
            console.log("[CREATE ORDER] GENERATED ORDER NUMBER:", orderNumber);
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
            console.log("[CREATE ORDER] ORDER CREATED:", order._id);
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
            console.log("[CREATE ORDER] KITCHEN TICKET CREATED");
            await table_model_1.default.findByIdAndUpdate(new mongoose_1.default.Types.ObjectId(tableId), {
                status: "occupied",
            });
            console.log("[CREATE ORDER] TABLE MARKED OCCUPIED");
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
        console.log("[CREATE ORDER] REORDER FLOW TRIGGERED");
        for (const newItem of resolvedItems) {
            const existingItem = order.items.find((i) => i.menuItemId.toString() === newItem.menuItemId.toString());
            if (existingItem) {
                console.log("[CREATE ORDER] UPDATING EXISTING ITEM:", newItem.name);
                existingItem.quantity += newItem.quantity;
                existingItem.total =
                    existingItem.quantity * existingItem.price;
            }
            else {
                console.log("[CREATE ORDER] ADDING NEW ITEM:", newItem.name);
                order.items.push(newItem);
            }
        }
        order.subtotal += subtotal;
        order.tax += tax;
        order.total += total;
        order.ticketCount += 1;
        console.log("[CREATE ORDER] UPDATED ORDER TOTALS:", {
            subtotal: order.subtotal,
            tax: order.tax,
            total: order.total,
            ticketCount: order.ticketCount,
        });
        await order.save();
        console.log("[CREATE ORDER] ORDER SAVED");
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
        console.log("[CREATE ORDER] KITCHEN TICKET CREATED (REORDER)");
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
        console.error("[CREATE ORDER] ERROR:", error);
        console.error("[CREATE ORDER] REQUEST BODY:", req.body);
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
        console.log("[UPDATE PAYMENT] PARAMS:", req.params);
        console.log("[UPDATE PAYMENT] BODY:", req.body);
        const { orderID } = req.params;
        const { status, paymentStatus } = req.body;
        const Payment = await order_repository_1.default.getByID(orderID);
        console.log("[UPDATE PAYMENT] EXISTING ORDER:", Payment);
        if (!Payment) {
            console.log("[UPDATE PAYMENT] NOT FOUND:", orderID);
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Payment not found",
                },
            };
        }
        const updated = await order_repository_1.default.updateStatus(orderID, status, paymentStatus);
        console.log("[UPDATE PAYMENT] UPDATED:", updated);
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
        console.error("[UPDATE PAYMENT] ERROR:", error);
        console.error("[UPDATE PAYMENT] PARAMS:", req.params);
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
        console.log("[DELETE ORDER] PARAMS:", req.params);
        const { orderID } = req.params;
        const order = await order_repository_1.default.getByID(orderID);
        console.log("[DELETE ORDER] EXISTING ORDER:", order);
        if (!order) {
            console.log("[DELETE ORDER] NOT FOUND:", orderID);
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Order not found",
                },
            };
        }
        const deletedOrder = await order_repository_1.default.delete(orderID);
        console.log("[DELETE ORDER] DELETED ORDER:", deletedOrder);
        if (deletedOrder) {
            await ticket_repository_1.default.deleteByOrderId(orderID);
            console.log("[DELETE ORDER] KITCHEN TICKETS DELETED");
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
        console.error("[DELETE ORDER] ERROR:", error);
        console.error("[DELETE ORDER] PARAMS:", req.params);
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
