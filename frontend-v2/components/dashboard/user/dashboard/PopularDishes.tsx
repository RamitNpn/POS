import DishItem from "./DishItem";

const dishes = [
  {
    id: 1,
    name: "Butter Chicken",
    orders: 250,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2ZWX5FdMcw7c__wKxJxZSHnpxW6P6gS_GFnnowVb1jS-ENe9tHT7dSxQ26F9qxUMOw5UhjzXl-1AEpZrjb7r9mwEkC1UZZ0R2NuumJIL2wsAdxdBP10YFJRllhCxEM5U8Cfr3X5QmjTePzmoq1VtASYr8R5yZJY-XgCgElSYdiJ1S9d2aFWdrVqPvp-ppafIOy04I7rrATqZzTAXdKsJeWlQ5mSDcZ7aF8kbK0wO09KSDgCnyX_DTDXy05cdOKBxiGc_l8zQtwAjM",
  },
  {
    id: 2,
    name: "Palak Paneer",
    orders: 190,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBpFkFqWoITu8pRCaqbVBNXJrDFE0tH-uPe_o0gD4DLOItDa_j40-viHSGahaJzAVn_NTpRNctOBMy4Al4LVt_-y-wj8b_I9czkW1jQDzNvG1FBNCCHTS0dn26rVUkLU35JtfkHG62D2DoTYGX8LlaV-A6CnIvacknqVNeH8fzU_EGWCafb5mqn_UEyUjatWT1EoxwcfAwBaDVQHoNUNh_KE0wyXYxHoJkkJB3vL3Jat1ggjHYH8c03Uw7FXte9UvVw5b20EqSxA5JX",
  },
  {
    id: 3,
    name: "Hyderabadi Biryani",
    orders: 300,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDAMKgOhd8wNsNPbp3qUch15xaC083K_TilagA74VNoOdc8D1I86Pv6vY7DPvxrUyGNAqJc5uYhItQc08eyWYXnt5GisbwHb_a_eOpk_RRPmHvERYz-zsc7LJUIf5DqxvhOZTBHAqzXHeTyYDaIbMZ7UvMxc1tC8nMi5bXLQvOiSu0RMo13B0HzwzNskbphNGFueQkUj7C_uItYfrhDHP8xUSV1pdzB3NiH0HVxlcA9CKyKP_1BdeIpen_tM7LfaBNkZgqq1tpw2UGf",
  },
  {
    id: 4,
    name: "Masala Dosa",
    orders: 220,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCH6Rjcz_5BWOLZfU-VQaRxMm1JU2mNT__aIMqb2ZYSunUfdtGSCeRr--NN-gAzosknlzP9rOdaH-1g8nTxjswf8pPnXgGinnM--D-t8YZpU75aTlITxrzIFr1rJMRJ3nwu8YPHOwTAH0nMHmgqfV0rZDhJw-Z8fBHtHA6oP_7DQ4AmKVUXpN4lvgykC_EXk_icr1IUjVd1m-m3_zaK_5xJYzyliWeNW9nXrVGuQ3WYWnPfvhi6gRD22224UrXNyvpGeBxh2cwz3cC9",
  },
];

export default function PopularDishes() {
  return (
    <div
      className="
        bg-[#1a1a1a]
        border
        border-[#2a2a2a]
        rounded-2xl
        p-6
        h-full
      "
    >
      <div className="flex items-center justify-between mb-8">

        <h3 className="text-xl font-bold">
          Popular Dishes
        </h3>

        <button className="text-blue-500 text-sm font-medium hover:underline">
          View all
        </button>

      </div>

      <div className="space-y-6">

        {dishes.map((dish, index) => (
          <DishItem
            key={dish.id}
            rank={index + 1}
            {...dish}
          />
        ))}

      </div>

    </div>
  );
}