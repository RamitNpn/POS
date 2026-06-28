import { z } from "zod";

export const orderStatusEnum = z.enum(["active", "completed", "cancelled"]);

export const paymentStatusEnum = z.enum(["pending", "partial", "paid"]);

export const paymentMethodEnum = z.enum(["cash", "online", "credit"]);

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
  discount: z.number().default(0),
  total: z.number(),
  ticketCount: z.number(),
  status: orderStatusEnum,
  paymentMethod: paymentMethodEnum,
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
  paymentMethod: paymentMethodEnum,
  discount: z.number().min(0).max(10).default(0),
  paymentStatus: paymentStatusEnum,
  status: orderStatusEnum,
});

export const deleteOrderSchema = z.object({
  _id: z.string(),
});
