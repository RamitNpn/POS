"use client";

import { Plus, Edit, Trash } from "lucide-react";

const logs = [
  { text: "Added Wagyu Steak", icon: Plus },
  { text: "Updated Truffle Pasta price", icon: Edit },
  { text: "Removed old Dessert item", icon: Trash },
];

export default function MenuLogs() {
  return (
    <div className="space-y-4">

      {logs.map((log, i) => {
        const Icon = log.icon;

        return (
          <div
            key={i}
            className="flex gap-4 items-center border-b border-white/10 pb-4"
          >
            <Icon className="text-yellow-400" />

            <p className="text-zinc-300">{log.text}</p>
          </div>
        );
      })}

    </div>
  );
}