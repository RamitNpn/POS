"use client";

import { Bell, LogOut, Search, UtensilsCrossed } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { UserRole } from "@/lib/types";

interface TopbarProps {
  title?: string;
}

function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    admin: "Administrator",
    waiter: "Server",
    kitchen: "Kitchen Staff",
    cashier: "Cashier",
  };
  return names[role];
}

export function Topbar({ title }: TopbarProps) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const roleDisplay = getRoleDisplayName(user.role);
  const isAdmin = roleDisplay.includes("Administrator");

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex w-full items-center gap-2 px-4">
          {isAdmin ? (
            <div>
              <SidebarTrigger className="-ml-1 touch-target" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
          ) : (
            <SidebarHeader className="">
              <div className="flex items-center gap-2 px-2 py-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                  <UtensilsCrossed className="size-5 text-primary-foreground" />
                </div>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-semibold text-sidebar-foreground">
                    DineFlow
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {roleDisplay}
                  </span>
                </div>
              </div>
            </SidebarHeader>
          )}

          {title && (
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          )}

          <div className="ml-auto flex items-center gap-2">

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative touch-target"
                >
                  <Bell className="size-5" />
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 size-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    3
                  </Badge>
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-success" />
                    <span className="font-medium">Order Ready</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Order #1044 for Table 7 is ready to serve
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-info" />
                    <span className="font-medium">New Order</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    New order #1043 received for Table 3
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-warning" />
                    <span className="font-medium">Low Stock Alert</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    House Red Wine is running low (3 bottles left)
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-primary">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="md:flex items-center px-2">
              <button
                onClick={logout}
                className="text-sm font-medium text-foreground"
              >
                <LogOut className="size-5 text-yellow-500" />
              </button>
            </div>

            {/* Mobile search button */}
            {/* <Button
              variant="ghost"
              size="icon"
              className="md:hidden touch-target"
              onClick={() => setShowMobileSearch((prev) => !prev)}
            >
              <Search className="size-5" />
              <span className="sr-only">Search</span>
            </Button> */}
          </div>
        </div>
      </header>
    </>
  );
}
