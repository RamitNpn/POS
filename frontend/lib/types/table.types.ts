export interface TTable {
  _id: string;
  name: string;
  capacity: number;
  status: string;
  section: string;
  sectionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TCreateTable {
  name: string;
  capacity: number;
  status: string;
  sectionId: string;
}
