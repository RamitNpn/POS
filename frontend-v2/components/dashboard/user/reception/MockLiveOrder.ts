"use client";

import { useEffect, useState } from "react";

const initialOrders = [
  {
    id: "ORD-201",
    customer: "Ram Sharma",
    table: "T-2",
    items: [{ name: "Burger", qty: 2, price: 120 }],
    status: "ready",
    isNew: false,
  },
];

export function useMockLiveOrders() {
  const [orders, setOrders] = useState(initialOrders);

  useEffect(() => {
    const interval = setInterval(() => {
      const newOrder = {
        id: "ORD-" + Math.floor(Math.random() * 1000),
        customer: "Walk-in Guest",
        table: "T-" + Math.ceil(Math.random() * 10),
        items: [
          { name: "Momo", qty: 1, price: 100 },
          { name: "Tea", qty: 2, price: 30 },
        ],
        status: "ready",
        isNew: true,
      };

      setOrders((prev) => [newOrder, ...prev]);
    }, 8000); // every 8 sec new order

    return () => clearInterval(interval);
  }, []);

  return { orders };
}