export interface TMenuItem {
  _id: string;
  name: string;
  description?: string;
  categoryId: string;
  price: number;
  preparationTime?: number;
  status: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TCreateMenuItem {
  name: string;
  description?: string;
  categoryId: string;
  price: number;
  preparationTime?: number;
  status: string;
  image: FileList;
}
