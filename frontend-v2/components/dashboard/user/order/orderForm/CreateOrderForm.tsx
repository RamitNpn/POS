"use client";

import { useState } from "react";
import FoodItemSelector from "./FoodItemSelector";

export default function OrderForm({ onClose }: { onClose: () => void }) {
  const [customerName, setCustomerName] = useState("");
  const [tableNo, setTableNo] = useState("");
  const [orderType, setOrderType] = useState("dine-in");
  const [items, setItems] = useState<
    { name: string; qty: number; price: number }[]
  >([]);

  const addItem = (item: any) => {
    setItems((prev) => [...prev, item]);
  };

  const total = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  const handleSubmit = () => {
    const payload = {
      customerName,
      tableNo,
      orderType,
      items,
      total,
      status: "pending",
    };

    console.log("ORDER CREATED (frontend only):", payload);
    onClose();
  };

  return (
    <div className="space-y-6 text-white">

      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="bg-[#262626] border border-[#333] rounded-lg px-3 py-2 text-sm"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <input
          className="bg-[#262626] border border-[#333] rounded-lg px-3 py-2 text-sm"
          placeholder="Table No (e.g. T-12)"
          value={tableNo}
          onChange={(e) => setTableNo(e.target.value)}
        />
      </div>

      {/* Order Type */}
      <div className="flex gap-3">
        {["dine-in", "takeaway", "delivery"].map((type) => (
          <button
            key={type}
            onClick={() => setOrderType(type)}
            className={`px-4 py-2 rounded-lg text-sm border transition ${
              orderType === type
                ? "bg-yellow-400 text-black border-yellow-400"
                : "bg-[#262626] border-[#333] text-gray-300"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Food Items */}
      <FoodItemSelector onAdd={addItem} />

      {/* Items List */}
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between bg-[#262626] px-3 py-2 rounded-lg text-sm"
          >
            <span>{item.name} x{item.qty}</span>
            <span>₹{item.qty * item.price}</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-between text-lg font-semibold border-t border-[#333] pt-3">
        <span>Total</span>
        <span className="text-yellow-400">₹{total}</span>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-[#262626] hover:bg-[#333]"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold"
        >
          Create Order
        </button>
      </div>
    </div>
  );
}