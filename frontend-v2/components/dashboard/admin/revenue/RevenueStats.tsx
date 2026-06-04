"use client";

import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";

const stats = [
  { title: "Total Income", value: "$58,400", icon: TrendingUp },
  { title: "Total Expenses", value: "$22,150", icon: TrendingDown },
  { title: "Net Profit", value: "$36,250", icon: DollarSign },
  { title: "Cash Balance", value: "$12,980", icon: Wallet },
];

export default function RevenueStats() {
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

              <Icon className="text-yellow-400 w-6 h-6" />

            </div>
          </div>
        );
      })}

    </div>
  );
}