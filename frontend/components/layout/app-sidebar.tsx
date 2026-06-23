"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Users,
  BarChart3,
  Settings,
  Table2,
  Bell,
  History,
  Receipt,
  LogOut,
  Shield,
  Building2,
  Grid3X3,
  CalendarClock,
  Tags,
  Pizza,
  Sliders,
  Package,
  ArrowUpDown,
  AlertTriangle,
  Truck,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  FileText,
  FileSpreadsheet,
  Activity,
  ScrollText,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "@/context/auth-context";
import type { UserRole, NavGroup } from "@/lib/types";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Admin Navigation with hierarchical structure
const adminNavGroups: NavGroup[] = [
  {
    title: "Overview",
    roles: ["admin"],
    items: [
      {
        title: "Dashboard",
        href: "/dashboard/admin",
        icon: LayoutDashboard,
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Management",
    roles: ["admin"],
    items: [
      {
        title: "Users",
        href: "/dashboard/admin/users",
        icon: Users,
        roles: ["admin"],
      },
      {
        title: "Roles & Permissions",
        href: "/dashboard/admin/roles-and-permission",
        icon: Shield,
        roles: ["admin"],
      },
      {
        title: "Branches",
        href: "/dashboard/admin/branches",
        icon: Building2,
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Restaurant",
    roles: ["admin"],
    items: [
      {
        title: "Tables",
        href: "/dashboard/admin/tables",
        icon: Table2,
        roles: ["admin"],
      },
      {
        title: "Rooms",
        href: "/dashboard/admin/sections",
        icon: Grid3X3,
        roles: ["admin"],
      },
      {
        title: "Reservations",
        href: "/dashboard/admin/reservations",
        icon: CalendarClock,
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Menu",
    roles: ["admin"],
    items: [
      {
        title: "Categories",
        href: "/dashboard/admin/menu/categories",
        icon: Tags,
        roles: ["admin"],
      },
      {
        title: "Food Items",
        href: "/dashboard/admin/menu/items",
        icon: Pizza,
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Inventory",
    roles: ["admin"],
    items: [
      {
        title: "Ingredients",
        href: "/dashboard/admin/inventory",
        icon: Package,
        roles: ["admin"],
      },
      {
        title: "Stock Movement",
        href: "/dashboard/admin/inventory/movement",
        icon: ArrowUpDown,
        roles: ["admin"],
      },
      {
        title: "Low Stock Alerts",
        href: "/dashboard/admin/inventory/alerts",
        icon: AlertTriangle,
        roles: ["admin"],
        // badge: 3,
      },
    ],
  },
  {
    title: "Suppliers",
    roles: ["admin"],
    items: [
      {
        title: "Supplier List",
        href: "/dashboard/admin/suppliers",
        icon: Truck,
        roles: ["admin"],
      },
      {
        title: "Purchase Orders",
        href: "/dashboard/admin/suppliers/orders",
        icon: ShoppingCart,
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Orders",
    roles: ["admin"],
    items: [
      {
        title: "Total Orders",
        href: "/dashboard/admin/orders",
        icon: ClipboardList,
        roles: ["admin"],
        // badge: 5,
      },
    ],
  },
  {
    title: "Finance",
    roles: ["admin"],
    items: [
      {
        title: "Revenue",
        href: "/dashboard/admin/finance/revenue",
        icon: DollarSign,
        roles: ["admin"],
      },
      {
        title: "Expenses",
        href: "/dashboard/admin/finance/expenses",
        icon: TrendingDown,
        roles: ["admin"],
      },
      {
        title: "Profit & Loss",
        href: "/dashboard/admin/finance/profit-loss",
        icon: TrendingUp,
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Reports",
    roles: ["admin"],
    items: [
      {
        title: "Daily Reports",
        href: "/dashboard/admin/reports/daily",
        icon: FileText,
        roles: ["admin"],
      },
      {
        title: "Tax Reports",
        href: "/dashboard/admin/reports/tax",
        icon: Receipt,
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Analytics",
    roles: ["admin"],
    items: [
      {
        title: "Sales Analytics",
        href: "/dashboard/admin/analytics/sales",
        icon: BarChart3,
        roles: ["admin"],
      },
      {
        title: "Food Analytics",
        href: "/dashboard/admin/analytics/food",
        icon: PieChart,
        roles: ["admin"],
      },
    ],
  },
  {
    title: "System",
    roles: ["admin"],
    items: [
      {
        title: "Notifications",
        href: "/dashboard/admin/notifications",
        icon: Bell,
        roles: ["admin"],
        // badge: 4,
      },
      {
        title: "Audit Logs",
        href: "/dashboard/admin/audit-logs",
        icon: ScrollText,
        roles: ["admin"],
      },
      {
        title: "Settings",
        href: "/dashboard/admin/settings",
        icon: Settings,
        roles: ["admin"],
      },
    ],
  },
];

function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    admin: "Administrator",
    waiter: "Server",
    kitchen: "Kitchen Staff",
    cashier: "Cashier",
  };
  return names[role];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const roleDisplay = getRoleDisplayName(user.role);


  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <UtensilsCrossed className="size-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold text-sidebar-foreground">
              LocalVibes
            </span>
            <span className="text-xs text-muted-foreground">{roleDisplay}</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {adminNavGroups.map((group) => (
          <Collapsible
            key={group.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent/50 rounded-md transition-colors">
                  <span>{group.title}</span>
                  <ChevronDown className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        (item.href !== "/dashboard/admin" &&
                          pathname.startsWith(item.href));
                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            tooltip={item.title}
                            className="touch-target"
                          >
                            <Link href={item.href}>
                              <item.icon className="size-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                          {item.badge && (
                            <SidebarMenuBadge className="bg-primary text-primary-foreground">
                              {item.badge}
                            </SidebarMenuBadge>
                          )}
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-primary/20 text-primary">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                side="top"
                align="start"
                sideOffset={8}
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {roleDisplay}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
