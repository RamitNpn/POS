"use client";

import CreateOrderModal from "@/components/dashboard/user/order/orderForm/CreateOrderModal";
import {
  Home,
  ClipboardList,
  Grid,
  Bell,
  ChefHat,
  Receipt,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

type Role = "waiter" | "kitchen" | "reception" | "admin";

export default function BottomNav({ role = "waiter" }: { role?: Role }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#121212]/95 backdrop-blur border-t border-[#2a2a2a]">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-3 sm:px-8 py-3">

          <NavItem
            label="Home"
            icon={<Home className="w-5 h-5" />}
            href="/pages/dashboard/user"
            active={pathname === "/pages/dashboard/user"}
          />

          {(role === "waiter" || role === "admin") && (
            <NavItem
              label="Tables"
              icon={<Grid className="w-5 h-5" />}
              href="/pages/dashboard/user/waiter/table"
              active={pathname.includes("/waiter/table")}
            />
          )}

          {(role === "kitchen" || role === "admin") && (
            <NavItem
              label="Kitchen"
              icon={<ChefHat className="w-5 h-5" />}
              href="/pages/dashboard/user/kitchen"
              active={pathname.includes("/kitchen")}
            />
          )}

          <button
            onClick={() => setOpen(true)}
            className="w-14 h-14 -mt-8 bg-yellow-400 text-black rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition"
          >
            <Bell className="w-6 h-6" />
          </button>

          {(role === "waiter" || role === "reception" || role === "admin") && (
            <NavItem
              label="Orders"
              icon={<ClipboardList className="w-5 h-5" />}
              href="/pages/dashboard/user/waiter/order"
              active={pathname.includes("/waiter/order")}
            />
          )}

          {(role === "reception" || role === "admin") && (
            <NavItem
              label="Billing"
              icon={<Receipt className="w-5 h-5" />}
              href="/pages/dashboard/user/reception"
              active={pathname.includes("/reception")}
            />
          )}

          <NavItem
            label="Menu"
            icon={<Menu className="w-5 h-5" />}
            href="/pages/dashboard/user/waiter/menu"
            active={pathname.includes("/menu")}
          />
        </div>
      </nav>

      <CreateOrderModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function NavItem({
  label,
  icon,
  href,
  active = false,
}: {
  label: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={`flex gap-1 text-[10px] sm:text-xs transition ${
        active ? "text-white" : "text-gray-500 hover:text-white"
      }`}
    >
      {icon}
      <span className="hidden sm:block">{label}</span>
    </a>
  );
}