"use client";

import {
  ShoppingBag,
  DollarSign,
  Clock3,
  AlertCircle,
} from "lucide-react";

const stats = [
  {
    title: "Total Orders",
    value: "1,284",
    icon: ShoppingBag,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    title: "Revenue",
    value: "$24,860",
    icon: DollarSign,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    title: "Pending Orders",
    value: "36",
    icon: AlertCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    title: "Avg Prep Time",
    value: "18 mins",
    icon: Clock3,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
];

export default function StatsCards() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-2xl border border-white/10 bg-[#141414] p-5"
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-zinc-400">
                  {item.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-white">
                  {item.value}
                </h2>
              </div>

              <div
                className={`rounded-xl p-4 ${item.bg}`}
              >
                <Icon
                  className={`h-6 w-6 ${item.color}`}
                />
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}