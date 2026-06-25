import { z } from "zod";

export const orderStatusEnum = z.enum(["active", "completed", "cancelled"]);

export const paymentStatusEnum = z.enum(["pending", "partial", "paid"]);

export const orderItemSchema = z.object({
  menuItemId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().min(1),
  total: z.number(),
});

export const createOrderSchema = z.object({
  tableId: z.string(),
  customerName: z.string().optional(),
  waiterId: z.string(),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1),
});

export const orderSchema = z.object({
  _id: z.string(),
  orderNumber: z.string(),
  tableId: z.string(),
  customerName: z.string(),
  waiterId: z.string(),
  notes: z.string().optional(),
  items: z.array(orderItemSchema),
  subtotal: z.number(),
  tax: z.number(),
  total: z.number(),
  ticketCount: z.number(),
  status: orderStatusEnum,
  paymentStatus: paymentStatusEnum,
  createdAt: z.date().optional(),
});

export const getAllOrdersSchema = z.array(orderSchema);

export const getOrderByIdSchema = orderSchema;

export const updateOrderSchema = z.object({
  customerName: z.string().optional(),
  notes: z.string().optional(),
  status: orderStatusEnum.optional(),
  paymentStatus: paymentStatusEnum.optional(),
});

export const updatePaymentSchema = z.object({
  printed: z.boolean().optional(),
  status: orderStatusEnum.optional(),
  paymentStatus: paymentStatusEnum.optional(),
});

export const deleteOrderSchema = z.object({
  _id: z.string(),
});
