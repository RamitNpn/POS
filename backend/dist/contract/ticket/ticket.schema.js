"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateKitchenTicketSchema = exports.getKitchenTicketByIdSchema = exports.getAllKitchenTicketsSchema = exports.kitchenTicketSchema = exports.kitchenTicketOrderSchema = exports.kitchenTicketTableSchema = exports.kitchenTicketWaiterSchema = exports.kitchenTicketItemSchema = exports.kitchenTicketStatusEnum = void 0;
const zod_1 = require("zod");
exports.kitchenTicketStatusEnum = zod_1.z.enum([
    "pending",
    "served",
    "cancelled",
    "completed",
]);
exports.kitchenTicketItemSchema = zod_1.z.object({
    menuItemId: zod_1.z.string(),
    name: zod_1.z.string(),
    quantity: zod_1.z.number().min(1),
});
exports.kitchenTicketWaiterSchema = zod_1.z.object({
    waiterId: zod_1.z.string().nullable().optional(),
    name: zod_1.z.string().nullable().optional(),
});
exports.kitchenTicketTableSchema = zod_1.z.object({
    tableId: zod_1.z.string(),
    tableName: zod_1.z.string().nullable().optional(),
    capacity: zod_1.z.number().nullable().optional(),
    status: zod_1.z.string().nullable().optional(),
});
exports.kitchenTicketOrderSchema = zod_1.z.object({
    orderId: zod_1.z.string(),
    orderNumber: zod_1.z.string().nullable().optional(),
    customerName: zod_1.z.string().nullable().optional(),
});
exports.kitchenTicketSchema = zod_1.z.object({
    _id: zod_1.z.string(),
    ticketNumber: zod_1.z.number(),
    status: exports.kitchenTicketStatusEnum,
    printed: zod_1.z.boolean(),
    createdAt: zod_1.z.date().optional(),
    order: exports.kitchenTicketOrderSchema.optional(),
    table: exports.kitchenTicketTableSchema.optional(),
    waiter: exports.kitchenTicketWaiterSchema.optional(),
    items: zod_1.z.array(exports.kitchenTicketItemSchema),
});
exports.getAllKitchenTicketsSchema = zod_1.z.array(exports.kitchenTicketSchema);
exports.getKitchenTicketByIdSchema = exports.kitchenTicketSchema;
exports.updateKitchenTicketSchema = zod_1.z.object({
    status: exports.kitchenTicketStatusEnum.optional(),
});
