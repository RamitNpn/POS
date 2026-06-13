import { z } from "zod";

export const paymentStatusEnum = z.enum(["pending", "paid", "refunded"]);

export const paymentMethodEnum = z.enum(["cash", "card", "mobile", "split"]);

export const orderItemSchema = z.object({
  menuItemId: z.string(),
  quantity: z.number().min(1),
  notes: z.string().optional(),
  price: z.number(),
});

export const createOrderSchema = z.object({
  orderNumber: z.string(),
  tableId: z.string(),
  items: z.array(orderItemSchema),
  customerName: z.string(),
  paymentStatus: paymentStatusEnum.optional(),
  paymentMethod: paymentMethodEnum.optional(),
  subtotal: z.number(),
  tax: z.number(),
  discount: z.number().optional(),
  serviceCharge: z.number().optional(),
  total: z.number(),
  notes: z.string().optional(),
  completedAt: z.coerce.date().optional(),
  waiterId: z.string(),
});

export const orderSchema = z.object({
  _id: z.string(),
  orderNumber: z.string(),
  tableId: z.string(),
  items: z.array(orderItemSchema),
  customerName: z.string(),
  paymentStatus: paymentStatusEnum,
  paymentMethod: paymentMethodEnum.optional(),
  subtotal: z.number(),
  tax: z.number(),
  discount: z.number().optional(),
  serviceCharge: z.number().optional(),
  total: z.number(),
  notes: z.string().optional(),
  completedAt: z.coerce.date().optional(),
  waiterId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const getOrderByIdSchema = orderSchema;

export const getAllOrdersSchema = z.array(orderSchema);

export const updateOrderSchema = z.object({
  tableId: z.string().optional(),
  items: z.array(orderItemSchema).optional(),
  customerName: z.string().optional(),
  paymentStatus: paymentStatusEnum.optional(),
  paymentMethod: paymentMethodEnum.optional(),
  subtotal: z.number().optional(),
  tax: z.number().optional(),
  discount: z.number().optional(),
  serviceCharge: z.number().optional(),
  total: z.number().optional(),
  notes: z.string().optional(),
  completedAt: z.coerce.date().optional(),
  waiterId: z.string().optional(),
});
