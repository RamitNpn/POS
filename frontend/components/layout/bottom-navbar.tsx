"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Table2,
  ClipboardList,
  UtensilsCrossed,
  Bell,
  ChefHat,
  History,
  Receipt,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

const simpleNavItems = [
  //waiter links
  {
    title: "Tables",
    href: "/dashboard/waiter",
    icon: Table2,
    roles: ["waiter"],
    exact: true,
  },
  {
    title: "Menu",
    href: "/dashboard/waiter/menu",
    icon: UtensilsCrossed,
    roles: ["waiter"],
  },
  {
    title: "Orders",
    href: "/dashboard/waiter/orders",
    icon: ClipboardList,
    roles: ["waiter"],
    badge: 3,
  },
  {
    title: "Notifications",
    href: "/dashboard/waiter/notifications",
    icon: Bell,
    roles: ["waiter"],
    badge: 2,
  },

  //kitchen links
  {
    title: "Active Orders",
    href: "/dashboard/kitchen",
    icon: ChefHat,
    roles: ["kitchen"],
    badge: 4,
    exact: true,
  },
  {
    title: "Order History",
    href: "/dashboard/kitchen/history",
    icon: History,
    roles: ["kitchen"],
  },
  {
    title: "Notifications",
    href: "/dashboard/kitchen/notification",
    icon: Bell,
    roles: ["kitchen"],
  },
  {
    title: "Settings",
    href: "/dashboard/kitchen/settings",
    icon: BarChart3,
    roles: ["kitchen"],
  },

  //reception links
  {
    title: "Checkout",
    href: "/dashboard/cashier",
    icon: Receipt,
    roles: ["cashier"],
    exact: true,
  },
  // {
  //   title: "Orders",
  //   href: "/dashboard/cashier/orders",
  //   icon: ClipboardList,
  //   roles: ["cashier"],
  // },
  {
    title: "Tables",
    href: "/dashboard/cashier/tables",
    icon: Table2,
    roles: ["cashier"],
  },
  {
    title: "Reports",
    href: "/dashboard/cashier/reports",
    icon: BarChart3,
    roles: ["cashier"],
  },
];

export function BottomNavbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const items = simpleNavItems.filter((i) => i.roles.includes(user.role));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t mt-12 border-sidebar-border">
      <div className="max-w-4xl mx-auto flex justify-between items-center px-4 py-2">
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center text-xs py-1 ${active ? "text-primary" : "text-muted-foreground"}`}
            >
              <Icon className="size-5" />
              <span className="md:block hidden truncate">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNavbar;
