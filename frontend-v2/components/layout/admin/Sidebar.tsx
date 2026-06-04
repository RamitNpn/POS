"use client";

import {
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  Users,
  Boxes,
  FileText,
  Banknote,
  BarChart3,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/pages/dashboard/admin" },
  { label: "Orders", icon: ShoppingCart, href: "/pages/dashboard/admin/order" },
  { label: "Food Menu", icon: UtensilsCrossed, href: "/pages/dashboard/admin/menu" },
  { label: "Staff", icon: Users, href: "/pages/dashboard/admin/staff" },
  { label: "Inventory", icon: Boxes, href: "/pages/dashboard/admin/inventory" },
  { label: "Billing", icon: FileText, href: "/pages/dashboard/admin/billing" },
  { label: "Revenue", icon: Banknote, href: "/pages/dashboard/admin/revenue" },
  { label: "Analytics", icon: BarChart3, href: "/pages/dashboard/admin/analytic" },
  { label: "Settings", icon: Settings, href: "/pages/dashboard/admin/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 h-screen bg-[#0f0f0f] border-r border-white/10 p-5 flex flex-col">
      {/* Brand */}
      <div className="text-white text-2xl font-bold mb-10">
        DineFlow Admin
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-2">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                active
                  ? "bg-yellow-400 text-black font-semibold"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto text-xs text-white/30">© 2026 DineFlow</div>
    </aside>
  );
}
