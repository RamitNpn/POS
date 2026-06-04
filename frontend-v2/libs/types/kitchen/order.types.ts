export type OrderStatus = "pending" | "cooking" | "ready";

export type Order = {
  id: string;
  table: string;
  customer: string;
  items: { name: string; qty: number }[];
  time: string;
  status: OrderStatus;
  priority?: "low" | "normal" | "high";
};