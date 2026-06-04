"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

const orders = [
  {
    id: "#1001",
    customer: "John Carter",
    items: "Wagyu Steak",
    table: "A12",
    amount: "$120",
    payment: "Paid",
    status: "Completed",
    date: "2026-06-01",
  },
  {
    id: "#1002",
    customer: "Emma Watson",
    items: "Truffle Pasta",
    table: "B05",
    amount: "$85",
    payment: "Pending",
    status: "Preparing",
    date: "2026-06-01",
  },
  {
    id: "#1003",
    customer: "Robert King",
    items: "Caviar Set",
    table: "VIP-2",
    amount: "$240",
    payment: "Paid",
    status: "Ready",
    date: "2026-06-01",
  },
  {
    id: "#1004",
    customer: "Sarah Lee",
    items: "Lobster Bisque",
    table: "C08",
    amount: "$65",
    payment: "Paid",
    status: "New Orders",
    date: "2026-06-01",
  },
];

const statusStyles = {
  Completed: "bg-green-500/15 text-green-400 border-green-500/30",

  Preparing: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",

  Ready: "bg-blue-500/15 text-blue-400 border-blue-500/30",

  "New Orders": "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function InventoryTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#0e0e0e]">
            <tr className="border-b border-white/10">
              <th className="px-5 py-4 text-left text-sm text-zinc-400">
                Order ID
              </th>

              <th className="px-5 py-4 text-left text-sm text-zinc-400">
                Customer
              </th>

              <th className="px-5 py-4 text-left text-sm text-zinc-400">
                Items
              </th>

              <th className="px-5 py-4 text-left text-sm text-zinc-400">
                Table
              </th>

              <th className="px-5 py-4 text-left text-sm text-zinc-400">
                Amount
              </th>

              <th className="px-5 py-4 text-left text-sm text-zinc-400">
                Payment
              </th>

              <th className="px-5 py-4 text-left text-sm text-zinc-400">
                Status
              </th>

              <th className="px-5 py-4 text-left text-sm text-zinc-400">
                Date
              </th>

              <th className="px-5 py-4 text-center text-sm text-zinc-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-white/5 hover:bg-white/[0.02]"
              >
                <td className="px-5 py-4 font-semibold text-yellow-400">
                  {order.id}
                </td>

                <td className="px-5 py-4 text-white">{order.customer}</td>

                <td className="px-5 py-4 text-zinc-300">{order.items}</td>

                <td className="px-5 py-4 text-zinc-300">{order.table}</td>

                <td className="px-5 py-4 text-green-400">{order.amount}</td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs border ${
                      order.payment === "Paid"
                        ? "bg-green-500/15 text-green-400 border-green-500/30"
                        : "bg-red-500/15 text-red-400 border-red-500/30"
                    }`}
                  >
                    {order.payment}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs ${
                      statusStyles[order.status as keyof typeof statusStyles]
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-zinc-400">{order.date}</td>

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
    </div>
  );
}
