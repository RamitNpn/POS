type UserRole = "admin" | "waiter" | "kitchen" | "cashier";

type UserStatus = "active" | "inactive" | "suspended";

export interface TUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  profile?: string;
  phone: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface TCreateUser {
  name: string;
  email: string;
  role: UserRole;
  profile?: FileList;
  password: string;
  phone: string;
  status: UserStatus;
}
