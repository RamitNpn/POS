"use client";

import { DollarSign, Receipt, TrendingUp, CreditCard } from "lucide-react";

const stats = [
  { title: "Total Revenue", value: "$48,920", icon: DollarSign },
  { title: "Invoices", value: "1,284", icon: Receipt },
  { title: "Paid Orders", value: "1,102", icon: CreditCard },
  { title: "Monthly Growth", value: "+18%", icon: TrendingUp },
];

export default function BillingStats() {
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