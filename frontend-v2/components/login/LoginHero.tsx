"use client";

import { useEffect } from "react";
import FloatingRevenue from "./FloatingRevenue";
import FloatingOrders from "./FloatingOrders";
import FloatingAnalytics from "./FloatingAnalytics";

export default function LoginHero() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const widgets = document.querySelectorAll(".parallax");

      const x = (e.clientX - window.innerWidth / 2) / 30;
      const y = (e.clientY - window.innerHeight / 2) / 30;

      widgets.forEach((el, i) => {
        const factor = (i + 1) * 0.3;
        (el as HTMLElement).style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="hidden md:flex flex-1 relative bg-[#121212] overflow-hidden items-center justify-center px-10">
      {/* Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-2xl w-full">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#1f1f1f] border border-[#333] mb-6">
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-gray-300">
            DINEFLOW
          </span>
        </div>

        <h1 className="text-4xl font-bold text-white leading-tight">
          Manage Your{" "}
          <span className="text-yellow-400 italic">Restaurant</span> Smarter
        </h1>

        {/* Floating widgets */}
        <div className="relative h-[420px] mt-10">
          <div className="parallax absolute top-0 left-0">
            <FloatingRevenue />
          </div>

          <div className="parallax absolute top-32 right-0">
            <FloatingOrders />
          </div>

          <div className="parallax absolute bottom-0 left-20">
            <FloatingAnalytics />
          </div>
        </div>
      </div>
    </section>
  );
}