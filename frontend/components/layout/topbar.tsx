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
import { useActivityLogs } from "@/hooks/admin/log/getAllLogs";
import { TActivityLog } from "@/lib/types/log.types";
import Link from "next/link";

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
  const isAdmin = user.role === "admin";

  const { data: logData } = useActivityLogs({
    page: 1,
    limit: 3,
    ...(user.role === "waiter" ? { module: "Order" } : {}),
  });

  const logs = logData?.data ?? [];

  const notificationRoute =
    user.role === "admin"
      ? "/dashboard/admin/notifications"
      : "/dashboard/waiter/notifications";

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
                    atiThi
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
            {(user.role === "admin" || user.role === "waiter") && (
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
                  {logs.map((log: TActivityLog) => (
                    <DropdownMenuItem
                      key={log._id}
                      className="flex flex-col items-start gap-1 hover:bg-gray-300 py-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{log.action}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {log.details}
                      </span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-primary">
                    <Link href={notificationRoute}>View all notifications</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <div className="md:flex items-center px-2">
              <button
                onClick={logout}
                className="text-sm font-medium text-foreground"
              >
                <LogOut className="size-5 text-yellow-500" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
