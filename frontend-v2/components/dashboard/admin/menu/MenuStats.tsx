"use client";

import { Utensils, Coffee, DollarSign, Package } from "lucide-react";

const stats = [
  { title: "Total Dishes", value: "128", icon: Utensils, color: "text-yellow-400" },
  { title: "Categories", value: "8", icon: Coffee, color: "text-blue-400" },
  { title: "Avg Price", value: "$24", icon: DollarSign, color: "text-green-400" },
  { title: "Out of Stock", value: "5", icon: Package, color: "text-red-400" },
];

export default function MenuStats() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

      {stats.map((s) => {
        const Icon = s.icon;

        return (
          <div
            key={s.title}
            className="bg-[#141414] border border-white/10 p-5 rounded-2xl"
          >
            <div className="flex justify-between items-center">

              <div>
                <p className="text-zinc-400 text-sm">{s.title}</p>
                <h2 className="text-white text-3xl font-bold mt-3">
                  {s.value}
                </h2>
              </div>

              <Icon className={`h-6 w-6 ${s.color}`} />
            </div>
          </div>
        );
      })}

    </div>
  );
}