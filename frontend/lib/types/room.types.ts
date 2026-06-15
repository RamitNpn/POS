export interface TRoom {
  _id: string;
  name: string;
  description?: string;
  tableCount: number;
  isActive: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TCreateRoom {
  name: string;
  description?: string;
  isActive: string;
}
