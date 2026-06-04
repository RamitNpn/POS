export default function CTAReservation() {
  return (
    <section id="reservation" className="px-6 py-24 text-center bg-[#0f0f0f]">
      <h2 className="text-3xl font-bold">
        Book Your Table Today
      </h2>

      <p className="text-gray-400 mt-4 max-w-xl mx-auto">
        Enjoy a premium dining experience with family and friends. Reserve your table in advance and avoid waiting time.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <button className="bg-yellow-400 text-black px-8 py-3 rounded font-bold hover:brightness-110 transition">
          Reserve Now
        </button>

        <button className="border border-[#333] px-8 py-3 rounded font-semibold text-white hover:border-yellow-400 transition">
          Call Us
        </button>
      </div>

      <p className="text-gray-500 text-sm mt-6">
        ✨ Instant confirmation • Free cancellation • Priority seating
      </p>
    </section>
  );
}