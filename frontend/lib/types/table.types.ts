export type TableStatus = "available" | "occupied" | "reserved";

export interface TTable {
  _id: string;
  name: string;
  capacity: number;
  status: TableStatus;
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
