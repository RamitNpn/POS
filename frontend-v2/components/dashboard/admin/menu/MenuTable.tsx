"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

const items = [
  {
    id: "#F001",
    name: "Wagyu Steak",
    category: "Main Course",
    price: "$45",
    stock: "In Stock",
    status: "Active",
  },
  {
    id: "#F002",
    name: "Truffle Pasta",
    category: "Main Course",
    price: "$28",
    stock: "Low",
    status: "Active",
  },
  {
    id: "#F003",
    name: "Chocolate Lava Cake",
    category: "Dessert",
    price: "$12",
    stock: "Out",
    status: "Inactive",
  },
];

export default function MenuTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">

      <table className="w-full">

        <thead className="bg-[#0e0e0e]">

          <tr className="border-b border-white/10">

            <th className="p-4 text-left text-zinc-400">ID</th>
            <th className="p-4 text-left text-zinc-400">Name</th>
            <th className="p-4 text-left text-zinc-400">Category</th>
            <th className="p-4 text-left text-zinc-400">Price</th>
            <th className="p-4 text-left text-zinc-400">Stock</th>
            <th className="p-4 text-left text-zinc-400">Status</th>
            <th className="p-4 text-center text-zinc-400">Actions</th>

          </tr>

        </thead>

        <tbody>

          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-white/5 hover:bg-white/[0.02]"
            >

              <td className="p-4 text-yellow-400 font-semibold">
                {item.id}
              </td>

              <td className="p-4 text-white">{item.name}</td>

              <td className="p-4 text-zinc-400">{item.category}</td>

              <td className="p-4 text-green-400">{item.price}</td>

              <td className="p-4">
                <span className="text-xs px-3 py-1 rounded-full border border-white/10 text-zinc-300">
                  {item.stock}
                </span>
              </td>

              <td className="p-4 text-zinc-400">{item.status}</td>

              <td className="p-4">
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