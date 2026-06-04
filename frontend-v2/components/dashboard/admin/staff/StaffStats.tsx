"use client";

import { Users, UserCheck, UserX, Briefcase } from "lucide-react";

const stats = [
  { title: "Total Staff", value: "48", icon: Users, color: "text-yellow-400" },
  { title: "Active Today", value: "32", icon: UserCheck, color: "text-green-400" },
  { title: "On Leave", value: "5", icon: UserX, color: "text-red-400" },
  { title: "Departments", value: "6", icon: Briefcase, color: "text-blue-400" },
];

export default function StaffStats() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

      {stats.map((s) => {
        const Icon = s.icon;

        return (
          <div
            key={s.title}
            className="bg-[#141414] border border-white/10 p-5 rounded-2xl"
          >
            <div className="flex justify-between">

              <div>
                <p className="text-zinc-400 text-sm">{s.title}</p>
                <h2 className="text-white text-3xl font-bold mt-3">
                  {s.value}
                </h2>
              </div>

              <Icon className={`w-6 h-6 ${s.color}`} />

            </div>
          </div>
        );
      })}

    </div>
  );
}