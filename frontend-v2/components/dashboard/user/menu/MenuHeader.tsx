"use client";

import { ArrowLeft } from "lucide-react";

export default function MenuHeader() {
  return (
    <header className="h-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 px-2">

      {/* LEFT SECTION */}
      <div className="flex items-center gap-2">
        <button className="p-[6px] rounded bg-blue-500 flex items-center justify-center hover:bg-blue-600">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-xl sm:text-2xl font-bold">
          Menu
        </h1>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search food..."
        className="
          bg-[#1f1f1f]
          px-4 py-2
          rounded-lg
          w-full sm:w-64 md:w-72 lg:w-80
          text-sm outline-none
        "
      />
    </header>
  );
}