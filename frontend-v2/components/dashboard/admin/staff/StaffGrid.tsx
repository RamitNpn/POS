"use client";

const roles = [
  "Manager",
  "Chef",
  "Waiter",
  "Cashier",
  "Cleaner",
  "Security",
];

export default function StaffGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

      {roles.map((role) => (
        <div
          key={role}
          className="bg-[#141414] border border-white/10 p-4 rounded-xl hover:border-yellow-500/40 transition"
        >
          <h3 className="text-white font-semibold">{role}</h3>
          <p className="text-zinc-400 text-xs mt-1">
            View staff under {role}
          </p>
        </div>
      ))}

    </div>
  );
}