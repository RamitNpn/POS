"use client";

import OrderCard from "./OrderCard";

const mockOrders = [
  {
    id: "ORD-101",
    customer: "Amrit Raj",
    table: "T-4",
    items: [
      { name: "Chicken Burger", qty: 2, price: 120 },
      { name: "Momo", qty: 1, price: 100 },
    ],
  },
  {
    id: "ORD-102",
    customer: "Sita Sharma",
    table: "T-2",
    items: [{ name: "Pizza", qty: 1, price: 250 }],
  },
];

export default function OrderList({ onSelectOrder }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {mockOrders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onClick={() => onSelectOrder(order)}
        />
      ))}
    </div>
  );
}