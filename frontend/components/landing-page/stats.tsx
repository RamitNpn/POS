export default function StatsSection() {
  return (
    <section id="stats" className="px-6 py-20 text-center">
      <h2 className="text-2xl font-bold mb-10">Live System Stats</h2>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-[#1c1c1c] p-6 rounded-xl">
          <h3 className="text-yellow-400 text-3xl font-bold">120+</h3>
          <p className="text-gray-400 mt-2">Daily Orders</p>
        </div>

        <div className="bg-[#1c1c1c] p-6 rounded-xl">
          <h3 className="text-yellow-400 text-3xl font-bold">24</h3>
          <p className="text-gray-400 mt-2">Active Tables</p>
        </div>

        <div className="bg-[#1c1c1c] p-6 rounded-xl">
          <h3 className="text-yellow-400 text-3xl font-bold">3</h3>
          <p className="text-gray-400 mt-2">Staff Roles</p>
        </div>
      </div>
    </section>
  );
}