export default function HeroSection() {
  return (
    <section className="px-6 py-20 text-center relative">
      {/* glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-yellow-400/10 blur-[120px] rounded-full" />

      <h1 className="text-4xl md:text-6xl font-bold leading-tight relative">
        Smart Restaurant <span className="text-yellow-400">Management</span>
        <br />
        for Modern Kitchens
      </h1>

      <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
        Manage orders, kitchen workflow, billing, and staff roles (Waiter,
        Kitchen, Receptionist) in one unified POS ecosystem.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <button className="bg-yellow-400 text-black px-6 py-3 rounded-[8px] font-semibold">
          Get Started
        </button>
        <button className="border border-[#333] px-6 py-3 rounded-[8px]">
          View Demo
        </button>
      </div>
    </section>
  );
}
