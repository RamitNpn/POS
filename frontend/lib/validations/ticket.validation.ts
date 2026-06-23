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

export type TKitchenTicketSchema = z.infer<typeof kitchenTicketSchema>;

export const getAllKitchenTicketsSchema = z.array(kitchenTicketSchema);

export type TGetAllKitchenTicketsSchema = z.infer<
  typeof getAllKitchenTicketsSchema
>;

export const getKitchenTicketByIdSchema = kitchenTicketSchema;

export type TGetTicketByIdSchema = z.infer<typeof getKitchenTicketByIdSchema>;

export const updateKitchenTicketSchema = z.object({
  printed: z.boolean().optional(),
  status: kitchenTicketStatusEnum.optional(),
});

export type TTicketStatusSchema = z.infer<typeof updateKitchenTicketSchema>;

export const deleteTicketSchema = z.object({
  _id: z.string().uuid("Invalid Room ID"),
});

export type TDeleteTicketSchema = z.infer<typeof deleteTicketSchema>;
