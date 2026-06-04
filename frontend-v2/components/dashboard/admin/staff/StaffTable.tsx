"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

const staff = [
  {
    id: "S001",
    name: "John Carter",
    role: "Chef",
    email: "john@example.com",
    phone: "+977-9800000001",
    shift: "Morning",
    salary: "$1200",
    status: "Active",
    join: "2024-01-12",
  },
  {
    id: "S002",
    name: "Emma Watson",
    role: "Waiter",
    email: "emma@example.com",
    phone: "+977-9800000002",
    shift: "Night",
    salary: "$800",
    status: "Active",
    join: "2024-03-18",
  },
];

export default function StaffTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full">
        <thead className="bg-black">
          <tr className="text-zinc-400 text-sm">
            <th className="p-4 text-left">ID</th>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Role</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Phone</th>
            <th className="p-4 text-left">Shift</th>
            <th className="p-4 text-left">Salary</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Join Date</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {staff.map((s) => (
            <tr key={s.id} className="border-b border-white/5">
              <td className="p-4 text-yellow-400">{s.id}</td>
              <td className="p-4 text-white">{s.name}</td>
              <td className="p-4 text-zinc-300">{s.role}</td>
              <td className="p-4 text-zinc-400">{s.email}</td>
              <td className="p-4 text-zinc-400">{s.phone}</td>
              <td className="p-4 text-zinc-400">{s.shift}</td>
              <td className="p-4 text-green-400">{s.salary}</td>

              <td className="p-4 text-green-400">{s.status}</td>
              <td className="p-4 text-zinc-400">{s.join}</td>

              <td className="px-5 py-4">
                <div className="flex items-center justify-center gap-3">
                  <button className="text-zinc-400 hover:text-yellow-400 transition">
                    <Eye size={18} />
                  </button>

                  <button className="text-zinc-400 hover:text-blue-400 transition">
                    <Pencil size={18} />
                  </button>

                  <button className="text-zinc-400 hover:text-red-400 transition">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
