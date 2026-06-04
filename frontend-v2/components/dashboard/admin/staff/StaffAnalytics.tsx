"use client";

export default function StaffAnalytics() {
  return (
    <div className="space-y-4 text-white">

      <div className="p-6 bg-black/30 border border-white/10 rounded-xl">
        <h2 className="font-semibold">Attendance Overview</h2>
        <p className="text-zinc-400 text-sm mt-2">
          92% attendance rate this month
        </p>
      </div>

      <div className="p-6 bg-black/30 border border-white/10 rounded-xl">
        <h2 className="font-semibold">Performance Score</h2>
        <p className="text-zinc-400 text-sm mt-2">
          Average staff rating: 4.6 / 5
        </p>
      </div>

    </div>
  );
}