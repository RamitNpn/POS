"use client";

import { X } from "lucide-react";
import { useState } from "react";

export default function AddTransactionModal({ onClose }: any) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    type: "Income",
    title: "",
    amount: "",
    category: "",
    date: "",
    method: "",
  });

  return (
    <>
      <div>
        <button
          onClick={() => setOpen(true)}
          className="bg-yellow-500 text-black px-4 py-2 rounded"
        >
          + Add Transaction
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#141414] w-[500px] p-6 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-xl font-bold">Add Transaction</h2>
              <X
                onClick={() => setOpen(false)}
                className="text-zinc-400 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select className="p-2 bg-black border border-white/10 text-white rounded">
                <option>Income</option>
                <option>Expense</option>
              </select>

              <input
                placeholder="Title"
                className="p-2 bg-black border border-white/10 text-white rounded"
              />

              <input
                placeholder="Amount"
                className="p-2 bg-black border border-white/10 text-white rounded"
              />

              <input
                placeholder="Category (Food, Salary, Rent)"
                className="p-2 bg-black border border-white/10 text-white rounded"
              />

              <input
                type="date"
                className="p-2 bg-black border border-white/10 text-white rounded"
              />

              <input
                placeholder="Payment Method (Cash/Card)"
                className="p-2 bg-black border border-white/10 text-white rounded"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="text-zinc-700 cursor-pointer bg-gray-200 rounded px-4 py-2"
              >
                Cancel
              </button>

              <button className="bg-yellow-500 text-black px-4 py-2 rounded cursor-pointer">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
