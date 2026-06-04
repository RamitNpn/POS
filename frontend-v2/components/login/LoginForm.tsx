"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = "password";

  return (
    <section className="flex flex-1 items-center justify-center bg-[#0f0f0f] px-6">
      <div className="w-full max-w-md">
        <div className="mb-4 text-center">
          <h2 className="text-white text-2xl font-bold mb-2">Welcome Back</h2>
          <p className="text-gray-400 mb-6 text-sm">
            Login to access dashboard
          </p>
        </div>

        <div className="bg-[#1c1c1c] border border-[#333] rounded-xl p-6 space-y-5">
          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input
              className="w-full bg-[#111] border border-[#333] p-3 rounded-lg text-white my-2 outline-none"
              placeholder="Email"
            />
          </div>

          <div className="relative">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">Password</label>
              <a
                className="text-primary font-label-md text-[12px] hover:underline"
                href="#"
              >
                Forgot Password?
              </a>
            </div>
            <div className="flex items-center relative my-2">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-[#111] border border-[#333] p-3 rounded-lg text-white pr-10 outline-none"
                placeholder="Password"
              />
              {isPassword && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
          </div>
          <a href="/pages/dashboard/user">
            <button className="w-full bg-yellow-400 text-black py-3 rounded-lg font-bold">
              Login
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
