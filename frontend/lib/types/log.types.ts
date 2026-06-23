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
