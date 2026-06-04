export default function AboutRestaurant() {
  return (
    <section
      id="about"
      className="relative px-6 py-24 bg-[#0f0f0f] text-center overflow-hidden"
    >
      <div className="relative z-10 max-w-5xl mx-auto">
        <p className="text-yellow-400 uppercase tracking-widest text-sm">
          About Us
        </p>

        <h2 className="text-4xl md:text-5xl font-bold mt-3 text-white">
          Crafted with Passion, <span className="text-yellow-400">Served with Love</span>
        </h2>

        <p className="text-gray-400 max-w-3xl mx-auto mt-6 text-lg leading-relaxed">
          Royal Spice Restaurant blends traditional South Asian heritage with
          modern culinary innovation. Every dish is carefully designed by expert
          chefs who believe food is not just taste — it is an experience,
          emotion, and memory on a plate.
        </p>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 text-left">
          <div className="bg-[#1a1a1a] border border-white/5 p-6 rounded-xl hover:border-yellow-400/30 transition">
            <h3 className="text-white font-semibold text-lg">🔥 Authentic Taste</h3>
            <p className="text-gray-400 mt-2 text-sm">
              Traditional recipes preserved with modern cooking precision.
            </p>
          </div>

          <div className="bg-[#1a1a1a] border border-white/5 p-6 rounded-xl hover:border-yellow-400/30 transition">
            <h3 className="text-white font-semibold text-lg">👨‍🍳 Expert Chefs</h3>
            <p className="text-gray-400 mt-2 text-sm">
              World-class culinary experts bringing restaurant-grade excellence.
            </p>
          </div>

          <div className="bg-[#1a1a1a] border border-white/5 p-6 rounded-xl hover:border-yellow-400/30 transition">
            <h3 className="text-white font-semibold text-lg">🥘 Premium Ingredients</h3>
            <p className="text-gray-400 mt-2 text-sm">
              Only the freshest and highest-quality ingredients used daily.
            </p>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          <div>
            <h3 className="text-3xl font-bold text-yellow-400">10+</h3>
            <p className="text-gray-400 text-sm mt-1">Years Experience</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-yellow-400">50+</h3>
            <p className="text-gray-400 text-sm mt-1">Expert Chefs</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-yellow-400">100+</h3>
            <p className="text-gray-400 text-sm mt-1">Menu Items</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-yellow-400">25K+</h3>
            <p className="text-gray-400 text-sm mt-1">Happy Customers</p>
          </div>
        </div>
      </div>
    </section>
  );
}