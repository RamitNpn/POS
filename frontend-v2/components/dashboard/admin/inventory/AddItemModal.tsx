"use client";

import { useState } from "react";

const categories = [
  "Starters",
  "Main Course",
  "Desserts",
  "Beverages",
  "Seafood",
  "Grill",
];

export default function AddItemModal() {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-yellow-500 text-black px-4 py-2 rounded font-semibold"
      >
        + Add Item
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#141414] w-[500px] p-6 rounded-2xl border border-white/10">
            <h2 className="text-white text-xl font-bold mb-4">Add Food Item</h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                className="p-2 bg-black border border-white/10 text-white rounded"
                placeholder="Item Name"
              />

              <select className="p-2 bg-black border border-white/10 text-white rounded">
                <option>Select Category</option>

                {categories.map((c: string) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <input
                className="p-2 bg-black border border-white/10 text-white rounded"
                placeholder="Price"
              />

              <input
                className="p-2 bg-black border border-white/10 text-white rounded"
                placeholder="Stock Quantity"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setOpen(false)} className="text-zinc-400">
                Cancel
              </button>

              <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg">
                Save Item
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
