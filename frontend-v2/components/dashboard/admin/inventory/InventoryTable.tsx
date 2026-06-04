"use client";

const items = [
  {
    id: "I001",
    name: "Wagyu Steak",
    category: "Main Course",
    stock: 24,
    price: "$45",
    status: "Available",
  },
  {
    id: "I002",
    name: "Truffle Pasta",
    category: "Main Course",
    stock: 5,
    price: "$28",
    status: "Low Stock",
  },
];

export default function InventoryTable() {
  return (
    <div className="overflow-x-auto">

      <table className="w-full text-sm">

        <thead className="text-zinc-400">

          <tr>
            <th className="p-4 text-left">ID</th>
            <th className="p-4 text-left">Item</th>
            <th className="p-4 text-left">Category</th>
            <th className="p-4 text-left">Stock</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left">Status</th>
          </tr>

        </thead>

        <tbody>

          {items.map((i) => (
            <tr key={i.id} className="border-b border-white/10">

              <td className="p-4 text-yellow-400">{i.id}</td>
              <td className="p-4 text-white">{i.name}</td>
              <td className="p-4 text-zinc-400">{i.category}</td>
              <td className="p-4 text-white">{i.stock}</td>
              <td className="p-4 text-green-400">{i.price}</td>
              <td className="p-4 text-zinc-300">{i.status}</td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}