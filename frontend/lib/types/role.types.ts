export interface TRole {
  _id: string;
  name: string;
  description?: string;
  userCount: number;
  isActive: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TCreateRole {
  name: string;
  description?: string;
  isActive: string;
}
