import { z } from "zod";

export const createOrderSchema = z.object({
  orderNumber: z.string().trim().min(1).max(50),
  tableId: z.string().min(1),
  items: z.array(
    z.object({
      menuItemId: z.string().min(1),
      quantity: z.number().min(1),
      price: z.number().min(0),
    })
  ),
  status: z.enum(["pending", "preparing", "ready", "served", "completed", "cancelled"]).default("pending"),
  userId: z.string().optional(),
  total: z.number().min(0),
});

export type TCreateOrderSchema = z.infer<typeof createOrderSchema>;

export const orderSchema = z.object({
  _id: z.string(),
  orderNumber: z.string(),
  tableId: z.string(),
  table: z.object({
    _id: z.string(),
    name: z.string(),
    capacity: z.number(),
    status: z.string(),
  }).optional(),
  items: z.array(
    z.object({
      menuItemId: z.string(),
      quantity: z.number(),
      price: z.number(),
    })
  ),
  status: z.string(),
  userId: z.string().optional(),
  total: z.number(),
});

export const getAllOrdersSchema = z.array(orderSchema);

export type TGetAllOrderSchema = z.infer<typeof getAllOrdersSchema>;

export const getOrderByIdSchema = orderSchema;

export type TGetOrderByIdSchema = z.infer<typeof getOrderByIdSchema>;

export const updateOrderSchema = z.object({
  orderNumber: z.string().trim().min(1).max(50).optional(),
  tableId: z.string().min(1).optional(),
  items: z.array(
    z.object({
      menuItemId: z.string().min(1),
      quantity: z.number().min(1),
      price: z.number().min(0),
    })
  ).optional(),
  status: z.enum(["pending", "preparing", "ready", "served", "completed", "cancelled"]).optional(),
  userId: z.string().optional(),
  total: z.number().min(0).optional(),
});

export type TUpdateOrderSchema = z.infer<typeof updateOrderSchema>;

export const deleteOrderSchema = z.object({
  _id: z.string(),
});

export type TDeleteOrderSchema = z.infer<typeof deleteOrderSchema>;
