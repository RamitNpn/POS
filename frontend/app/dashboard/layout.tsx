'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { QueryProvider } from '@/providers/query-provider';
import { SocketProvider } from '@/providers/socket-provider';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { BottomNavbar } from '@/components/layout/bottom-navbar';
import { Topbar } from '@/components/layout/topbar';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isLoading || !user) return;

    const role = user.role;

    const sectionGuards: { prefix: string; allowed: string[] }[] = [
      { prefix: '/dashboard/admin', allowed: ['admin'] },
      { prefix: '/dashboard/cashier', allowed: ['cashier', 'admin'] },
      { prefix: '/dashboard/waiter', allowed: ['waiter', 'admin'] },
      { prefix: '/dashboard/kitchen', allowed: ['kitchen', 'admin'] },
    ];

    if (!pathname) return;

    for (const guard of sectionGuards) {
      if (pathname.startsWith(guard.prefix)) {
        if (!guard.allowed.includes(role)) {
          router.back();
          setTimeout(() => {
            if (typeof window !== 'undefined' && window.location.pathname.startsWith(guard.prefix)) {
              router.replace('/dashboard');
            }
          }, 100);
        }
        break;
      }
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      {user.role === 'admin' && (<AppSidebar />)}
      <SidebarInset>
        <Topbar />
        <main className={`flex-1 overflow-auto p-4 md:p-6 ${user.role === "admin" ? 'mb-1' : 'mb-14'}`}>
          {children}
        </main>
      </SidebarInset>
      {user.role !== 'admin' && <BottomNavbar />}
    </SidebarProvider>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <AuthProvider>
        <SocketProvider>
          <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </SocketProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
