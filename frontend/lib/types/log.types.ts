export type UserRole = "admin" | "waiter" | "kitchen" | "cashier";

export interface User {
  name: string;
  email: string;
  role: UserRole;
}

export interface TActivityLog {
  _id: string;
  userId: string;
  user: User;
  action: string;
  details: string;
  module?: string;
  entityId?: string;
  entityType?: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TActivityEntityItem {
  menuItemId?: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface TActivityEntity {
  orderNumber?: string;
  tableId?: string;
  customerName?: string;
  subtotal?: number;
  tax?: number;
  total?: number;
  items?: TActivityEntityItem[];
}

export interface TNotificationLog {
  _id: string;
  userId: string;
  user: User;
  action: string;
  details: string;
  module?: string;
  entityId?: string;

  entityType?: string;

  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TParsedNotificationLog extends TNotificationLog {
  entity: TActivityEntity | null;
}
