const features = [
  "Real-time Order Sync",
  "Kitchen Display System (KDS)",
  "Role-based Access Control",
  "Revenue Analysis and Daily Report",
  "Invoice Generator",
  "Live Table Management",
];

export default function FeatureSection() {
  return (
    <section id="features" className="px-6 py-20 bg-[#0f0f0f]">
      <h2 className="text-2xl font-bold text-center mb-10">
        Powerful Features
      </h2>

      <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-[#1c1c1c] border border-[#2a2a2a] p-4 rounded-lg"
          >
            {f}
          </div>
        ))}
      </div>
    </section>
  );
}