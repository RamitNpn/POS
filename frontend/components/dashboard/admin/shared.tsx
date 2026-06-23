"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function statusStyle(status: string) {
  switch (status) {
    case "active":
    case "paid":
    case "approved":
    case "available":
      return "bg-emerald-100 text-emerald-700";
    case "reserved":
      return "bg-yellow-100 text-yellow-700";
    case "occupied":
      return "bg-rose-100 text-rose-700";
    case "received":
    case "confirmed":
      return "bg-emerald-100 text-emerald-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "out-of-stock":
    case "draft":
      return "bg-amber-100 text-amber-700";
    case "cancelled":
    case "refunded":
    case "hidden":
      return "bg-rose-100 text-rose-700";
    case "completed":
    case "served":
      return "bg-sky-100 text-sky-700";
    case "preparing":
    case "in":
      return "bg-blue-100 text-blue-700";
    case "out":
    case "adjustment":
    case "waste":
      return "bg-violet-100 text-violet-700";
    default:
      return "bg-muted/20 text-muted-foreground";
  }
}

export function MetricCard({ title, value, description }: { title: string; value: string | number; description?: string }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}

export function PageSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function SearchField({ id, label, value, onChange, placeholder, className }: { id: string; label?: string; value: string; onChange: (value: string) => void; placeholder?: string; className?: string }) {
  return (
    <div className={`grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end ${className}`}>
      <div>
        <Label htmlFor={id}>{label}</Label>
        <Input id={id} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder ?? 'Search...'} />
      </div>
    </div>
  );
}

export function TableBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full bg-muted px-2 py-1 text-xs font-medium text-foreground/80">{label}</span>
  );
}

export function formatDate(value?: string | Date) {
  if (!value) return '-';
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
