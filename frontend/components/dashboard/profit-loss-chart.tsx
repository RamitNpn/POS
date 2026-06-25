"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Area,
  AreaChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ProfitLossData = {
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
  orders: number;
};

type Period = "7d" | "30d" | "90d" | "1y" | "all";

interface ProfitLossChartProps {
  data: ProfitLossData[];
  title?: string;
  description?: string;
  period: string;
  setPeriod: (value: Period) => void;
}
export function ProfitLossChart({
  data,
  title = "Profit & Loss Overview",
  description = "Revenue vs Expenses comparison",
  period,
  setPeriod,
}: ProfitLossChartProps) {
  console.log("ProfitLossChart data:", data);

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-foreground">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>

        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
            <SelectItem value="1y">Last Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[468px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="profit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="date"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `Rs ${v}`}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;

                  const data = payload[0].payload;

                  return (
                    <div className="rounded-lg border bg-popover p-3 shadow-lg">
                      <p className="text-sm font-medium">{label}</p>

                      <p className="text-sm text-green-500">
                        Revenue: Rs {data.revenue.toLocaleString()}
                      </p>

                      <p className="text-sm text-red-500">
                        Expenses: Rs {data.expense.toLocaleString()}
                      </p>

                      <p className="text-sm text-blue-500">
                        Profit: Rs {data.profit.toLocaleString()}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Orders: {data.totalOrders}
                      </p>
                    </div>
                  );
                }}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#22c55e"
                fill="url(#revenue)"
                strokeWidth={2}
              />

              <Area
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                fillOpacity={0.05}
                strokeWidth={2}
              />

              <Line
                type="monotone"
                dataKey="profit"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
