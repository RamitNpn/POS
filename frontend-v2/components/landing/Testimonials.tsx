const reviews = [
  {
    name: "Aarav Sharma",
    text: "Best dining experience I’ve had in years. The food quality, presentation, and service were absolutely exceptional.",
    rating: 5,
    role: "Food Blogger",
  },
  {
    name: "Sita Rai",
    text: "Loved the ambience and quick service. The staff is very polite and attentive. Highly recommended for family dinners!",
    rating: 5,
    role: "Regular Customer",
  },
  {
    name: "John Miller",
    text: "Authentic taste with a modern twist. Every dish felt carefully crafted. Will definitely visit again!",
    rating: 4,
    role: "Tourist",
  },
  {
    name: "Anita Verma",
    text: "The biryani here is unmatched. Perfect spice balance and aroma. Truly a hidden gem!",
    rating: 5,
    role: "Food Critic",
  },
  {
    name: "Rahul Gupta",
    text: "Great atmosphere and quick service. Ideal place for both casual and fine dining.",
    rating: 4,
    role: "Business Owner",
  },
  {
    name: "Emily Watson",
    text: "Beautiful presentation and amazing flavors. The desserts are absolutely must-try!",
    rating: 5,
    role: "Traveler",
  },
];

export default function Testimonials() {
  return (
    <section id="reviews" className="px-6 py-24 bg-[#0f0f0f]">
      <h2 className="text-4xl font-bold text-center mb-4 text-white">
        What Customers Say
      </h2>

      <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
        Real experiences from our guests who enjoy authentic flavors and
        premium dining service.
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="bg-[#1c1c1c] border border-[#2a2a2a] p-6 rounded-xl hover:border-yellow-400/30 transition"
          >
            {/* Stars */}
            <div className="flex gap-1 text-yellow-400 text-sm mb-3">
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </div>

            {/* Review text */}
            <p className="text-gray-300 text-sm leading-relaxed">
              “{r.text}”
            </p>

            {/* Footer */}
            <div className="mt-5 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">{r.name}</p>
                <p className="text-gray-500 text-xs">{r.role}</p>
              </div>

              {/* Avatar placeholder */}
              <div className="w-9 h-9 rounded-full bg-yellow-400/20 border border-yellow-400 flex items-center justify-center text-yellow-400 font-bold text-sm">
                {r.name.charAt(0)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}