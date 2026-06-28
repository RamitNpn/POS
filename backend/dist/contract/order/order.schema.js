"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrderSchema = exports.updatePaymentSchema = exports.updateOrderSchema = exports.getOrderByIdSchema = exports.getAllOrdersSchema = exports.orderSchema = exports.createOrderSchema = exports.orderItemSchema = exports.paymentMethodEnum = exports.paymentStatusEnum = exports.orderStatusEnum = void 0;
const zod_1 = require("zod");
exports.orderStatusEnum = zod_1.z.enum(["active", "completed", "cancelled"]);
exports.paymentStatusEnum = zod_1.z.enum(["pending", "partial", "paid"]);
exports.paymentMethodEnum = zod_1.z.enum(["cash", "online", "credit"]);
exports.orderItemSchema = zod_1.z.object({
    menuItemId: zod_1.z.string(),
    name: zod_1.z.string(),
    price: zod_1.z.number(),
    quantity: zod_1.z.number().min(1),
    total: zod_1.z.number(),
});
exports.createOrderSchema = zod_1.z.object({
    tableId: zod_1.z.string(),
    customerName: zod_1.z.string().optional(),
    waiterId: zod_1.z.string(),
    notes: zod_1.z.string().optional(),
    items: zod_1.z.array(exports.orderItemSchema).min(1),
});
exports.orderSchema = zod_1.z.object({
    _id: zod_1.z.string(),
    orderNumber: zod_1.z.string(),
    tableId: zod_1.z.string(),
    customerName: zod_1.z.string(),
    waiterId: zod_1.z.string(),
    notes: zod_1.z.string().optional(),
    items: zod_1.z.array(exports.orderItemSchema),
    subtotal: zod_1.z.number(),
    tax: zod_1.z.number(),
    discount: zod_1.z.number().default(0),
    total: zod_1.z.number(),
    ticketCount: zod_1.z.number(),
    status: exports.orderStatusEnum,
    paymentMethod: exports.paymentMethodEnum,
    paymentStatus: exports.paymentStatusEnum,
    createdAt: zod_1.z.date().optional(),
});
exports.getAllOrdersSchema = zod_1.z.array(exports.orderSchema);
exports.getOrderByIdSchema = exports.orderSchema;
exports.updateOrderSchema = zod_1.z.object({
    customerName: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    status: exports.orderStatusEnum.optional(),
    paymentStatus: exports.paymentStatusEnum.optional(),
});
exports.updatePaymentSchema = zod_1.z.object({
    paymentMethod: exports.paymentMethodEnum,
    discount: zod_1.z.number().min(0).max(10).default(0),
    paymentStatus: exports.paymentStatusEnum,
    status: exports.orderStatusEnum,
});
exports.deleteOrderSchema = zod_1.z.object({
    _id: zod_1.z.string(),
});
