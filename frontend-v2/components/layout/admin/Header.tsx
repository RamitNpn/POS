"use client";

import { Bell, Mail, LogOut } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full h-16 px-6 flex items-center justify-between bg-[#121212] border-b border-white/10">
      {/* Left */}
      <div>
        <h1 className="text-white font-semibold">Welcome, Owner</h1>
        <p className="text-xs text-white/40">DineFlow Restaurant Panel</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5 text-white/70">
        <button className="relative hover:text-white">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full" />
        </button>

        <button className="hover:text-white">
          <Mail size={20} />
        </button>

        <button className="flex items-center gap-2 bg-red-500/10 text-red-400 px-3 py-1 rounded-lg hover:bg-red-500/20">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}