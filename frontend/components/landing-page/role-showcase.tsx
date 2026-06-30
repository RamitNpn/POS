const roles = [
  {
    title: "Waiter",
    desc: "Create orders, manage tables, send requests to kitchen",
    color: "bg-blue-500/10 text-blue-400",
  },
  {
    title: "Kitchen Staff",
    desc: "View incoming orders, update cooking status in real-time",
    color: "bg-red-500/10 text-red-400",
  },
  {
    title: "Receptionist",
    desc: "Generate bills, handle payments, manage invoices",
    color: "bg-green-500/10 text-green-400",
  },
];

export default function RoleShowcase() {
  return (
    <section id="roles" className="px-6 py-20">
      <h2 className="text-2xl font-bold text-center mb-10">
        Built for 3 Core Roles
      </h2>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {roles.map((r, i) => (
          <div
            key={i}
            className="bg-[#1c1c1c] border border-[#2a2a2a] p-6 rounded-xl"
          >
            <div className={`inline-block px-3 py-1 rounded-full text-sm ${r.color}`}>
              {r.title}
            </div>
            <p className="text-gray-400 mt-4 text-sm">{r.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}