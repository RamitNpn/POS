"use client";

import { Bell, Search, ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function TopNavbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#121212] border-b border-[#2a2a2a]">
      <div className="flex items-center justify-between px-8 sm:px-10 py-3 gap-3">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm sm:text-2xl">DineFlow</span>
          </div>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              className="w-full bg-[#1c1c1c] rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:ring-1 focus:ring-yellow-400"
              placeholder="Search tables, orders..."
            />
          </div>
        </div>

        {/* Mobile search toggle */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="md:hidden p-2 rounded-md hover:bg-white/10"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block bg-[#1c1c1c] border border-[#2a2a2a] rounded-full px-3 py-1 text-sm text-gray-400">
            <a href="/pages/dashboard/admin" className="text-sm text-gray-400 hover:text-white">
              Admin Dashboard
            </a>
          </div>
          <button className="relative p-2 text-gray-400 hover:text-white">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full" />
          </button>

          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-semibold leading-tight">
              Amrit Raj
            </span>
            <span className="text-xs text-gray-400">Waiter</span>
          </div>

          <div className="w-8 h-8 rounded-full bg-gray-700" />
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="px-4 pb-3 md:hidden">
          <input
            className="w-full bg-[#1c1c1c] rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-yellow-400"
            placeholder="Search..."
          />
        </div>
      )}
    </header>
  );
}