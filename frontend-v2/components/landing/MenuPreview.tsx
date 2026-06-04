const items = [
  {
    name: "Paneer Tikka",
    price: "₹250",
    desc: "Smoky grilled cottage cheese marinated in spices",
    tag: "Veg",
  },
  {
    name: "Chicken Biryani",
    price: "₹320",
    desc: "Aromatic basmati rice cooked with tender chicken & herbs",
    tag: "Chef Special",
  },
  {
    name: "Momo Platter",
    price: "₹180",
    desc: "Steamed dumplings served with spicy chutney",
    tag: "Popular",
  },
  {
    name: "Masala Tea",
    price: "₹60",
    desc: "Traditional spiced tea brewed with fresh milk",
    tag: "Hot Drink",
  },
  {
    name: "Butter Chicken",
    price: "₹340",
    desc: "Creamy tomato-based curry with tender chicken pieces",
    tag: "Best Seller",
  },
  {
    name: "Veg Chowmein",
    price: "₹160",
    desc: "Stir-fried noodles with fresh vegetables and sauces",
    tag: "Quick Bite",
  },
  {
    name: "Grilled Fish",
    price: "₹420",
    desc: "Fresh fish grilled with lemon butter seasoning",
    tag: "Premium",
  },
  {
    name: "Cold Coffee",
    price: "₹120",
    desc: "Chilled coffee blended with ice cream and milk",
    tag: "Beverage",
  },
];

export default function MenuPreview() {
  return (
    <section id="menu" className="px-6 py-24 bg-[#121212]">
      <h2 className="text-4xl font-bold text-center mb-4 text-white">
        Popular Dishes
      </h2>

      <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
        Discover our chef-curated signature dishes crafted with fresh ingredients
        and authentic flavors.
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-[#1c1c1c] border border-[#2a2a2a] p-5 rounded-xl hover:border-yellow-400/30 transition group"
          >
            {/* Tag */}
            <span className="text-[10px] uppercase tracking-widest text-yellow-400">
              {item.tag}
            </span>

            {/* Name */}
            <h3 className="text-white font-semibold mt-2 group-hover:text-yellow-400 transition">
              {item.name}
            </h3>

            {/* Description */}
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              {item.desc}
            </p>

            {/* Price */}
            <div className="mt-4 flex justify-between items-center">
              <span className="text-yellow-400 font-bold">{item.price}</span>

              <button className="text-xs px-3 py-1 border border-[#333] rounded hover:bg-yellow-400 hover:text-black transition">
                Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}