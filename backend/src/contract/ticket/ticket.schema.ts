import { z } from "zod";

export const kitchenTicketStatusEnum = z.enum([
  "pending",
  "served",
  "cancelled",
  "completed",
]);

export const kitchenTicketItemSchema = z.object({
  menuItemId: z.string(),
  name: z.string(),
  quantity: z.number().min(1),
  price: z.number(),
});

export const kitchenTicketWaiterSchema = z.object({
  waiterId: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
});

export const kitchenTicketTableSchema = z.object({
  tableId: z.string(),
  tableName: z.string().nullable().optional(),
  capacity: z.number().nullable().optional(),
  status: z.string().nullable().optional(),
});

export const kitchenTicketOrderSchema = z.object({
  orderId: z.string(),
  orderNumber: z.string().nullable().optional(),
  customerName: z.string().nullable().optional(),
});

export const kitchenTicketSchema = z.object({
  _id: z.string(),
  ticketNumber: z.number(),
  status: kitchenTicketStatusEnum,
  printed: z.boolean(),
  createdAt: z.date().optional(),
  order: kitchenTicketOrderSchema.optional(),
  table: kitchenTicketTableSchema.optional(),
  waiter: kitchenTicketWaiterSchema.optional(),
  items: z.array(kitchenTicketItemSchema),
});

export const getAllKitchenTicketsSchema = z.array(kitchenTicketSchema);

export const getKitchenTicketByIdSchema = kitchenTicketSchema;

export const updateKitchenTicketSchema = z.object({
  status: kitchenTicketStatusEnum.optional(),
});
