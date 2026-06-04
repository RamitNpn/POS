"use client";

import { useState } from "react";

export default function AddStaffModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-yellow-500 text-black px-4 py-2 rounded font-semibold"
      >
        + Add Staff
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#141414] w-[600px] p-6 rounded-2xl border border-white/10">
            <h2 className="text-white text-xl font-bold mb-4">Add New Staff</h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                className="p-2 bg-black border border-white/10 text-white rounded-md outline-none"
                placeholder="Full Name"
              />

              <input
                className="p-2 bg-black border border-white/10 text-white rounded-md outline-none"
                placeholder="Email"
              />

              <input
                className="p-2 bg-black border border-white/10 text-white rounded-md outline-none"
                placeholder="Phone"
              />

              <select className="p-2 bg-black border border-white/10 text-white rounded-md outline-none">
              <option disabled selected>Role</option>
                <option>Manager</option>
                <option>Chef</option>
                <option>Waiter</option>
                <option>Cashier</option>
                <option>Cleaner</option>
                <option>Security</option>
              </select>

              <input
                className="p-2 bg-black border border-white/10 text-white rounded-md outline-none"
                placeholder="Shift (Morning/Night)"
              />

              <input
                className="p-2 bg-black border border-white/10 text-white rounded-md outline-none"
                placeholder="Salary"
              />

              <input
                className="p-2 bg-black border border-white/10 text-white rounded-md outline-none"
                placeholder="Address"
              />

              <input
                className="p-2 bg-black border border-white/10 text-white rounded-md outline-none"
                placeholder="Emergency Contact"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-zinc-700 rounded cursor-pointer bg-gray-200"
              >
                Cancel
              </button>

              <button className="bg-yellow-500 text-black px-4 py-2 rounded cursor-pointer">
                Save Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
