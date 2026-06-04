"use client";

import { X } from "lucide-react";
import { useState } from "react";

export default function AddCategoryModal({ onClose }: any) {
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex gap-3">
        <button
          onClick={() => setOpen(true)}
          className="bg-yellow-500 text-black px-4 py-2 rounded font-semibold"
        >
          + Add Category
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#141414] w-[400px] p-6 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-xl font-bold">
                Add Category
              </h2>
              <X
                onClick={() => setOpen(false)}
                className="text-zinc-400 cursor-pointer"
              />
            </div>
            <input
              className="w-full p-2 bg-black border border-white/10 text-white outline-none rounded-md"
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setOpen(false)}
               className="text-zinc-700 cursor-pointer bg-gray-200 rounded px-4 py-2">
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
