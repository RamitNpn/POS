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
});

export const kitchenTicketSchema = z.object({
  _id: z.string(),
  orderId: z.string(),
  tableId: z.string(),
  ticketNumber: z.number(),
  items: z.array(kitchenTicketItemSchema),
  printed: z.boolean(),
  status: kitchenTicketStatusEnum,
  createdAt: z.date().optional(),
});

export const getAllKitchenTicketsSchema = z.array(kitchenTicketSchema);

export const getKitchenTicketByIdSchema = kitchenTicketSchema;

export const updateKitchenTicketSchema = z.object({
  printed: z.boolean().optional(),
  status: kitchenTicketStatusEnum.optional(),
});
