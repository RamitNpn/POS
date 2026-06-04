"use client";

import CategoryGrid from "@/components/dashboard/user/menu/CategoryGrid";
import FoodGrid from "@/components/dashboard/user/menu/FoodGrid";
import MenuHeader from "@/components/dashboard/user/menu/MenuHeader";
import OrderSidebar from "@/components/dashboard/user/menu/OrderSidebar";
import { useState } from "react";

const initialItems = [
  {
    id: "1",
    name: "Paneer Tikka",
    price: 250,
    category: "Starters",
    image:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8",
  },
  {
    id: "2",
    name: "Chicken Tikka",
    price: 300,
    category: "Starters",
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
  },
  {
    id: "3",
    name: "Samosa",
    price: 100,
    category: "Starters",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950",
  },
];

export default function MenuPage() {
  const [category, setCategory] = useState("Starters");
  const [items, setItems] = useState(initialItems);
  const [order, setOrder] = useState<any[]>([]);

  const addItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    setOrder((prev) => {
      const exists = prev.find((p) => p.name === item.name);

      if (exists) {
        return prev.map((p) =>
          p.name === item.name
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }

      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    setOrder((prev) =>
      prev
        .map((p) =>
          p.name === item.name
            ? { ...p, qty: p.qty - 1 }
            : p
        )
        .filter((p) => p.qty > 0)
    );
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full h-full">

      {/* LEFT CONTENT */}
      <div className="flex flex-col gap-4 w-full xl:w-[70%] min-w-0">

        <MenuHeader />

        <CategoryGrid
          active={category}
          onSelect={setCategory}
        />

        <div className="flex-1 overflow-y-auto min-h-0">
          <FoodGrid
            items={items}
            onAdd={addItem}
            onRemove={removeItem}
          />
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-full xl:w-[30%] min-w-0">

        {/* Desktop Sidebar */}
        <div className="hidden xl:block h-full">
          <OrderSidebar items={order} />
        </div>

        {/* Tablet / Mobile Sidebar */}
        <div className="block xl:hidden">
          <OrderSidebar items={order} />
        </div>

      </div>
    </div>
  );
}