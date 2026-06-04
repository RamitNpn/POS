"use client";

import {
  Clock3,
  ChefHat,
  Receipt,
  CheckCircle2,
} from "lucide-react";

const logs = [
  {
    id: 1,
    icon: Receipt,
    color: "text-yellow-400",
    title: "Order Created",
    description: "Order #1001 created by John Carter",
    time: "10:02 AM",
  },
  {
    id: 2,
    icon: ChefHat,
    color: "text-blue-400",
    title: "Kitchen Update",
    description: "Order #1002 moved to Preparing",
    time: "10:15 AM",
  },
  {
    id: 3,
    icon: Clock3,
    color: "text-red-400",
    title: "Payment Pending",
    description: "Order #1004 awaiting payment",
    time: "10:28 AM",
  },
  {
    id: 4,
    icon: CheckCircle2,
    color: "text-green-400",
    title: "Order Completed",
    description: "Order #1003 successfully delivered",
    time: "10:42 AM",
  },
];

export default function OrderLogs() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#101010] p-6">

      <h2 className="mb-8 text-xl font-bold text-white">
        Activity Timeline
      </h2>

      <div className="space-y-8">

        {logs.map((log) => {
          const Icon = log.icon;

          return (
            <div
              key={log.id}
              className="flex gap-5"
            >

              <div
                className={`mt-1 rounded-xl bg-black/40 p-3 ${log.color}`}
              >
                <Icon size={22} />
              </div>

              <div className="flex-1 border-b border-white/10 pb-6">

                <div className="flex items-center justify-between">

                  <h3 className="font-semibold text-white">
                    {log.title}
                  </h3>

                  <span className="text-xs text-zinc-500">
                    {log.time}
                  </span>

                </div>

                <p className="mt-2 text-zinc-400">
                  {log.description}
                </p>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}