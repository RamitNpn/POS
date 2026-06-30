const items = [
  { name: "Paneer Tikka", price: "Rs.250" },
  { name: "Chicken Biryani", price: "Rs.320" },
  { name: "Momo Platter", price: "Rs.180" },
  { name: "Masala Tea", price: "Rs.60" },
];

export default function MenuPreview() {
  return (
    <section id="menu" className="px-6 py-20 bg-[#121212]">
      <h2 className="text-3xl font-bold text-center mb-10">
        Popular Dishes
      </h2>

      <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-[#1c1c1c] border border-[#2a2a2a] p-5 rounded-xl text-center"
          >
            <h3 className="text-white font-semibold">{item.name}</h3>
            <p className="text-yellow-400 mt-2">{item.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}