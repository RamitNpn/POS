"use client";

import { Clock } from "lucide-react";
import LiveClock from "./LiveClock";

export default function KitchenHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-bold">Kitchen Board</h1>
        <p className="text-gray-400 text-sm">
          Live order workflow management
        </p>
      </div>

      <div className="flex items-center gap-2 bg-[#1c1c1c] px-4 py-2 rounded-xl border border-[#2a2a2a]">
        <Clock className="w-4 h-4 text-yellow-400" />
        <LiveClock />
      </div>
    </div>
  );
}