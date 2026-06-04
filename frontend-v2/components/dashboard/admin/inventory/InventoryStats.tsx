"use client";

import { Package, Layers, AlertTriangle, Utensils } from "lucide-react";

const stats = [
  { title: "Total Items", value: "142", icon: Utensils, color: "text-yellow-400" },
  { title: "Categories", value: "10", icon: Layers, color: "text-blue-400" },
  { title: "Low Stock", value: "8", icon: AlertTriangle, color: "text-red-400" },
  { title: "Inventory Value", value: "$18,450", icon: Package, color: "text-green-400" },
];

export default function InventoryStats() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

      {stats.map((s) => {
        const Icon = s.icon;

        return (
          <div
            key={s.title}
            className="bg-[#141414] border border-white/10 p-5 rounded-2xl"
          >
            <div className="flex justify-between">

              <div>
                <p className="text-zinc-400 text-sm">{s.title}</p>
                <h2 className="text-white text-3xl font-bold mt-3">
                  {s.value}
                </h2>
              </div>

              <Icon className={`w-6 h-6 ${s.color}`} />

            </div>
          </div>
        );
      })}

    </div>
  );
}