export interface TMenuSubCategory {
  _id: string;
  name: string;
  description?: string;
  categoryId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TCreateMenuSubCategory {
  name: string;
  description?: string;
  categoryId: string;
  isActive: boolean;
}
