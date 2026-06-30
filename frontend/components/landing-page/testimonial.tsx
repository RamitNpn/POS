const reviews = [
  {
    name: "Aarav Sharma",
    text: "Best dining experience! Food quality is exceptional.",
  },
  {
    name: "Sita Rai",
    text: "Loved the ambience and quick service. Highly recommended!",
  },
  {
    name: "John Miller",
    text: "Authentic taste and great hospitality. Will visit again!",
  },
];

export default function Testimonials() {
  return (
    <section id="reviews" className="px-6 py-20 bg-[#0f0f0f]">
      <h2 className="text-3xl font-bold text-center mb-10">
        What Customers Say
      </h2>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="bg-[#1c1c1c] border border-[#2a2a2a] p-6 rounded-xl"
          >
            <p className="text-gray-300 text-sm">"{r.text}"</p>
            <p className="text-yellow-400 mt-4 font-semibold">
              — {r.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}