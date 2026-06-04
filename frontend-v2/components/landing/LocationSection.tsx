export default function LocationSection() {
  return (
    <section
      id="location"
      className="px-6 py-24 bg-[#121212] text-center"
    >
      <h2 className="text-4xl font-bold text-white mb-4">Visit Us</h2>

      <p className="text-gray-400 max-w-2xl mx-auto">
        Experience fine dining at our central location in Kathmandu. We welcome
        guests daily with fresh meals, warm hospitality, and a premium ambience.
      </p>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-10 text-left">
        <div className="bg-[#1c1c1c] border border-[#2a2a2a] p-5 rounded-xl">
          <h3 className="text-white font-semibold mb-2">📍 Address</h3>
          <p className="text-gray-400 text-sm">
            New Baneshwor, Kathmandu, Nepal
          </p>
        </div>

        <div className="bg-[#1c1c1c] border border-[#2a2a2a] p-5 rounded-xl">
          <h3 className="text-white font-semibold mb-2">⏰ Opening Hours</h3>
          <p className="text-gray-400 text-sm">10:00 AM – 10:00 PM</p>
          <p className="text-gray-500 text-xs mt-1">Open 7 days a week</p>
        </div>

        <div className="bg-[#1c1c1c] border border-[#2a2a2a] p-5 rounded-xl">
          <h3 className="text-white font-semibold mb-2">📞 Contact</h3>
          <p className="text-gray-400 text-sm">+977 9800000000</p>
          <p className="text-gray-400 text-sm">info@royalspice.com</p>
        </div>
      </div>

      {/* Map */}
      <div className="mt-12 max-w-5xl mx-auto rounded-xl overflow-hidden border border-[#2a2a2a]">
        <iframe
          src="https://www.google.com/maps?q=New%20Baneshwor%20Kathmandu&output=embed"
          width="100%"
          height="400"
          loading="lazy"
          className="w-full opacity-50 hover:opacity-100 transition"
        ></iframe>
      </div>
    </section>
  );
}