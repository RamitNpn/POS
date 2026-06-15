export interface TOrder {
  _id: string;
  orderNumber: string;
  tableId: string;
  table?: {
    _id: string;
    name: string;
    capacity: number;
    status: string;
  };
  items: Array<{
    menuItemId: string;
    quantity: number;
    price: number;
  }>;
  status: string;
  userId?: string;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TCreateOrder {
  orderNumber: string;
  tableId: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
    price: number;
  }>;
  status: string;
  userId?: string;
  total: number;
}
