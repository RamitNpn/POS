"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const revenueData = [
  { day: "Mon", revenue: 1200 },
  { day: "Tue", revenue: 2100 },
  { day: "Wed", revenue: 1800 },
  { day: "Thu", revenue: 2900 },
  { day: "Fri", revenue: 4200 },
  { day: "Sat", revenue: 5100 },
  { day: "Sun", revenue: 3800 },
];

const statusData = [
  { name: "Completed", value: 45 },
  { name: "Preparing", value: 18 },
  { name: "Ready", value: 12 },
  { name: "New Orders", value: 20 },
];

const popularItems = [
  { item: "Steak", orders: 48 },
  { item: "Pasta", orders: 35 },
  { item: "Burger", orders: 29 },
  { item: "Pizza", orders: 41 },
];

const peakHours = [
  { hour: "10AM", orders: 8 },
  { hour: "12PM", orders: 25 },
  { hour: "2PM", orders: 31 },
  { hour: "5PM", orders: 18 },
  { hour: "8PM", orders: 42 },
];

const COLORS = [
  "#EAB308",
  "#22C55E",
  "#3B82F6",
  "#EF4444",
];

export default function OrderAnalytics() {
  return (
    <div className="space-y-8">

      <div className="grid gap-6 xl:grid-cols-2">

        {/* Revenue Chart */}

        <div className="rounded-2xl border border-white/10 bg-[#101010] p-5">

          <h2 className="mb-6 text-lg font-semibold text-white">
            Revenue Trend
          </h2>

          <ResponsiveContainer width="100%" height={300}>

            <LineChart data={revenueData}>

              <CartesianGrid stroke="#27272a" />

              <XAxis
                dataKey="day"
                stroke="#a1a1aa"
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#EAB308"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* Pie Chart */}

        <div className="rounded-2xl border border-white/10 bg-[#101010] p-5">

          <h2 className="mb-6 text-lg font-semibold text-white">
            Orders By Status
          </h2>

          <ResponsiveContainer width="100%" height={300}>

            <PieChart>

              <Pie
                data={statusData}
                dataKey="value"
                outerRadius={100}
              >
                {statusData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      <div className="grid gap-6 xl:grid-cols-2">

        {/* Popular Items */}

        <div className="rounded-2xl border border-white/10 bg-[#101010] p-5">

          <h2 className="mb-6 text-lg font-semibold text-white">
            Popular Menu Items
          </h2>

          <ResponsiveContainer width="100%" height={300}>

            <BarChart data={popularItems}>

              <CartesianGrid stroke="#27272a" />

              <XAxis
                dataKey="item"
                stroke="#a1a1aa"
              />

              <Tooltip />

              <Bar
                dataKey="orders"
                fill="#EAB308"
                radius={[8, 8, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* Peak Hours */}

        <div className="rounded-2xl border border-white/10 bg-[#101010] p-5">

          <h2 className="mb-6 text-lg font-semibold text-white">
            Peak Order Hours
          </h2>

          <div className="space-y-5">

            {peakHours.map((hour) => (
              <div
                key={hour.hour}
                className="space-y-2"
              >

                <div className="flex justify-between">

                  <span className="text-zinc-300">
                    {hour.hour}
                  </span>

                  <span className="text-yellow-400">
                    {hour.orders} Orders
                  </span>

                </div>

                <div className="h-3 rounded-full bg-zinc-800">

                  <div
                    className="h-3 rounded-full bg-yellow-400"
                    style={{
                      width: `${hour.orders * 2}%`,
                    }}
                  />

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}