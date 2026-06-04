export default function HeroRestaurant() {
  return (
    <section
      id="hero"
      className="custom-bg relative h-[90vh] flex items-center justify-center text-center px-6 bg-[#121212] overflow-hidden"
    >
      {/* 🎥 Background Video (Public CDN) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40"  
      >
        <source
          src="https://media.istockphoto.com/id/1152439883/video/dolly-shot-time-lapse-defocus-night-life.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl">
        <p className="text-yellow-400 tracking-widest uppercase text-sm">
          Welcome to
        </p>

        <h1 className="text-5xl md:text-6xl font-bold mt-3 text-white">
          Royal Spice <span className="text-yellow-400">Restaurant</span>
        </h1>

        <p className="text-gray-300 mt-6 text-lg">
          Experience authentic taste, crafted by expert chefs with love and tradition.
          Fresh ingredients. Perfect taste. Every time.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button className="bg-yellow-400 text-black px-6 py-3 rounded font-semibold outline-none hover:brightness-110 transition">
            View Menu
          </button>

          <button className="border border-[#333] text-white px-6 py-3 rounded outline-none hover:bg-white/10 transition">
            Book Table
          </button>
        </div>
      </div>
    </section>
  );
}