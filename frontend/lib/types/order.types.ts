export type OrderStatus = "active" | "completed" | "cancelled";

export type PaymentStatus = "pending" | "partial" | "paid";

export type PaymentMethod = "cash" | "online" | "credit";

export interface TOrder {
  _id: string;
  orderNumber: string;
  tableId: string;
  table?: {
    _id: string;
    name: string;
    capacity: number;
    status: string;
    section?: string;
  };
  waiterId: string;
  waiter?: {
    _id: string;
    name: string;
    email: string;
    role: string;
    phone: string;
    status: string;
    profile?: string;
  };
  customerName?: string;
  notes?: string;
  items: Array<{
    menuItem: string;
    quantity: number;
    price: number;
    total?: number;
    menuItemId?: {
      _id: string;
      name: string;
      image?: string;
    };
  }>;
  subtotal: number;
  tax: number;
  discount?: number;
  serviceCharge?: number;
  total: number;
  ticketCount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TCreateOrder {
  tableId: string;
  customerName?: string;
  waiterId: string;
  notes?: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
    price: number;
    total?: number;
  }>;
}
