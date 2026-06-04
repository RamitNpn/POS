export type TableStatus = "booked" | "available";

export interface Table {
  id: number;
  name: string;
  seats: number;
  status: TableStatus;
  initials: string;
}

export const tablesData: Table[] = [
  { id: 1, name: "Table 1", seats: 4, status: "booked", initials: "AM" },
  { id: 2, name: "Table 2", seats: 6, status: "available", initials: "MB" },
  { id: 3, name: "Table 3", seats: 2, status: "booked", initials: "JS" },
  { id: 4, name: "Table 4", seats: 4, status: "available", initials: "HR" },
  { id: 5, name: "Table 5", seats: 3, status: "booked", initials: "PL" },
  { id: 6, name: "Table 6", seats: 4, status: "available", initials: "RT" },
  { id: 7, name: "Table 7", seats: 5, status: "booked", initials: "LC" },
  { id: 8, name: "Table 8", seats: 5, status: "available", initials: "DP" },
];
