"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full px-6 py-3 flex justify-between items-center backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black font-bold">
          DF
        </div>
        <span className="text-xl font-bold text-white">DineFlow</span>
      </div>

      <nav className="hidden md:flex gap-8 text-sm text-gray-200">
        <a href="/pages/landing-page" className="hover:text-yellow-400 transition">
          Home
        </a>
        <a href="#about" className="hover:text-yellow-400 transition">
          About
        </a>
        <a href="#reviews" className="hover:text-yellow-400 transition">
          Reviews
        </a>
        <a href="#location" className="hover:text-yellow-400 transition">
          Location
        </a>
        <a href="#reservation" className="hover:text-yellow-400 transition">
          Reservation
        </a>
      </nav>

      <div className="hidden md:flex items-center gap-3">
        <button className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold outline-none hover:brightness-110 transition">
          <a href="/pages/login">Login</a>
        </button>
      </div>

      <button className="md:hidden text-white" onClick={() => setOpen(true)}>
        <Menu className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-[#1a1a1a] flex justify-end">
          <div className="w-full h-full bg-[#1a1a1a] flex flex-col gap-3 shadow-xl animate-slideInRight">
            <div className="flex items-center justify-between px-6 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white">
                  DineFlow
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="self-end text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-5 text-gray-300 bg-[#1a1a1a] text-base px-6 py-4">
              <a onClick={() => setOpen(false)} href="/pages/landing-page">
                Home
              </a>
              <a onClick={() => setOpen(false)} href="#about">
                About
              </a>
              <a onClick={() => setOpen(false)} href="#reviews">
                Reviews
              </a>
              <a onClick={() => setOpen(false)} href="#location">
                Location
              </a>
              <a onClick={() => setOpen(false)} href="#reservation">
                Reservation
              </a>
              <button className="mt-1 bg-yellow-400 text-black py-3 rounded font-semibold outline-none">
                <a href="/pages/login">Login</a>
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
