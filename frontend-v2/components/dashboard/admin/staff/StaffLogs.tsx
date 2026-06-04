"use client";

const logs = [
  "John assigned as Head Chef",
  "Emma marked as present",
  "New waiter added to system",
];

export default function StaffLogs() {
  return (
    <div className="space-y-3 text-zinc-300">

      {logs.map((l, i) => (
        <div
          key={i}
          className="border-b border-white/10 pb-3"
        >
          {l}
        </div>
      ))}

    </div>
  );
}