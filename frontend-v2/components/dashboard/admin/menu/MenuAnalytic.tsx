"use client";

export default function MenuAnalytics() {
  return (
    <div className="text-white space-y-4">

      <div className="bg-black/30 border border-white/10 p-6 rounded-xl">
        <h2 className="font-semibold">Top Selling Items</h2>
        <p className="text-zinc-400 text-sm mt-2">
          Steak, Pasta and Pizza dominate sales
        </p>
      </div>

      <div className="bg-black/30 border border-white/10 p-6 rounded-xl">
        <h2 className="font-semibold">Category Performance</h2>
        <p className="text-zinc-400 text-sm mt-2">
          Main Course generates 60% revenue share
        </p>
      </div>

    </div>
  );
}