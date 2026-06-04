"use client";

import { ArrowLeft } from "lucide-react";

export default function OrdersHeader() {
  return (
    <div className="flex items-center gap-4">

      <button
        className="
          w-10
          h-10
          rounded-full
          bg-blue-600
          hover:bg-blue-700
          flex
          items-center
          justify-center
          transition-colors
        "
      >
        <ArrowLeft size={20} />
      </button>

      <h1 className="text-2xl font-bold">
        Orders
      </h1>

    </div>
  );
}