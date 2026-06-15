export interface TMenuCategory {
  _id: string;
  name: string;
  description?: string;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TCreateMenuCategory {
  name: string;
  description?: string;
  itemCount: number;
}
