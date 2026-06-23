export type Status = "pending" | "served" | "cancelled" | "completed";

export interface TTicketItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface TTicketWaiter {
  waiterId?: string | null;
  name?: string | null;
}

export interface TTicketTable {
  tableId: string;
  tableName?: string | null;
  capacity?: number | null;
  status?: string | null;
}

export interface TTicketOrder {
  orderId: string;
  customerName?: string | null;
}

export interface TTicket {
  _id: string;
  ticketNumber: number;
  orderNumber?: string | null;
  printed: boolean;
  status: Status;
  createdAt?: Date;
  updatedAt?: Date;
  order?: TTicketOrder;
  table?: TTicketTable;
  waiter?: TTicketWaiter;
  items: TTicketItem[];
}