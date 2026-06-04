"use client";

import { useEffect, useState } from "react";
import KitchenColumn from "./KitchenColumn";
import { Order, OrderStatus } from "@/libs/types/kitchen/order.types";

const mockOrders: Order[] = [
  {
    id: "ORD-101",
    table: "T5",
    customer: "Amrit Raj",
    time: "08:32 PM",
    status: "pending",
    priority: "high",
    items: [
      { name: "Burger", qty: 2 },
      { name: "Fries", qty: 1 },
    ],
  },
  {
    id: "ORD-102",
    table: "T2",
    customer: "Sita Sharma",
    time: "08:40 PM",
    status: "cooking",
    priority: "normal",
    items: [{ name: "Pizza", qty: 1 }],
  },
  {
    id: "ORD-103",
    table: "T8",
    customer: "John Doe",
    time: "08:45 PM",
    status: "ready",
    priority: "low",
    items: [{ name: "Thali", qty: 1 }],
  },
];

export default function KitchenBoard() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  /* fake real-time update */
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prev) => [...prev]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      <KitchenColumn
        title="Pending"
        color="text-gray-400"
        orders={orders.filter((o) => o.status === "pending")}
        onAction={updateStatus}
      />

      <KitchenColumn
        title="Cooking"
        color="text-orange-400"
        orders={orders.filter((o) => o.status === "cooking")}
        onAction={updateStatus}
      />

      <KitchenColumn
        title="Ready"
        color="text-green-400"
        orders={orders.filter((o) => o.status === "ready")}
        onAction={updateStatus}
      />
    </div>
  );
}