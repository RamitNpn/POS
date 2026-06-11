"use client";

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api/mock-data';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Notification } from '@/lib/types';

const categoryOptions = [
  { value: 'all', label: 'All categories' },
  { value: 'orders', label: 'Orders' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'system', label: 'System' },
  { value: 'finance', label: 'Finance' },
];

export default function KitchenNotificationsPage() {
  const { data: notifications = [] } = useQuery<Notification[]>({ queryKey: ['notifications'], queryFn: api.getNotifications });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = useMemo(() => {
    return notifications.filter(n => {
      const term = search.trim().toLowerCase();
      if (term && !(`${n.title} ${n.message}`.toLowerCase().includes(term))) return false;
      if (category !== 'all' && n.category !== category) return false;
      return true;
    });
  }, [notifications, search, category]);

  return (
    <div className="space-y-6">
      <DashboardHeader title="Notifications" description="Kitchen notifications and alerts." />

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground">Search</label>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notifications" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Category</label>
            <Select value={category} onValueChange={(v) => setCategory(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filtered.length ? filtered.map(n => (
          <Card key={n.id} className="border-border">
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">{n.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{n.type} — {n.category}</p>
              </div>
              <div className="text-sm text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{n.message}</p>
            </CardContent>
          </Card>
        )) : (
          <Card className="border-border">
            <CardContent>
              <p className="text-center text-muted-foreground">No notifications</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
