"use client";

import { useState } from "react";

const MENU = [
  { name: "Chicken Burger", price: 120 },
  { name: "Veg Pizza", price: 250 },
  { name: "Momo", price: 100 },
  { name: "Fried Rice", price: 180 },
];

export default function FoodItemSelector({
  onAdd,
}: {
  onAdd: (item: any) => void;
}) {
  const [selected, setSelected] = useState(MENU[0]);
  const [qty, setQty] = useState(1);

  return (
    <div className="bg-[#262626] p-4 rounded-xl space-y-3 border border-[#333]">
      
      <p className="text-sm text-gray-400">Add Food Items</p>

      <div className="flex flex-col md:flex-row gap-3">
        <select
          className="flex-1 bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded-lg text-sm"
          onChange={(e) =>
            setSelected(MENU.find((m) => m.name === e.target.value)!)
          }
        >
          {MENU.map((item) => (
            <option key={item.name}>{item.name}</option>
          ))}
        </select>

        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="w-20 bg-[#1c1c1c] border border-[#333] px-2 py-2 rounded-lg text-sm"
        />

        <button
          onClick={() =>
            onAdd({ name: selected.name, price: selected.price, qty })
          }
          className="px-4 py-2 bg-yellow-400 text-black rounded-lg text-sm font-semibold"
        >
          Add
        </button>
      </div>
    </div>
  );
}