export interface TInventory {
  _id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  reorderLevel: number;
  minimumStock: number;
  supplierId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TCreateInventory {
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  reorderLevel: number;
  minimumStock: number;
  supplierId?: string;
}
