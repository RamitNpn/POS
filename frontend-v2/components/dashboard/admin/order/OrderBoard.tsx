"use client";

const columns = [
  {
    title: "New Orders",
    border: "border-red-500",
  },
  {
    title: "Preparing",
    border: "border-yellow-400",
  },
  {
    title: "Ready",
    border: "border-green-500",
  },
  {
    title: "Completed",
    border: "border-blue-500",
  },
];

const orders = [
  {
    id: "#1001",
    customer: "John Carter",
    item: "Wagyu Steak",
    status: "New Orders",
    time: "2m ago",
  },
  {
    id: "#1002",
    customer: "Emma Watson",
    item: "Truffle Pasta",
    status: "Preparing",
    time: "5m ago",
  },
  {
    id: "#1003",
    customer: "Robert King",
    item: "Caviar Set",
    status: "Ready",
    time: "8m ago",
  },
  {
    id: "#1004",
    customer: "Sarah Lee",
    item: "Lobster Bisque",
    status: "Completed",
    time: "10m ago",
  },
];

export default function OrderBoard() {
  return (
    <div className="grid gap-5 xl:grid-cols-4">

      {columns.map((col) => (
        <div
          key={col.title}
          className={`rounded-2xl border bg-[#141414] p-5 ${col.border}`}
        >

          <div className="flex items-center justify-between mb-5">

            <h2 className="font-semibold text-white">
              {col.title}
            </h2>

            <span className="rounded-full bg-black/30 px-3 py-1 text-xs text-zinc-400">
              {
                orders.filter(
                  (o) => o.status === col.title
                ).length
              }
            </span>

          </div>

          <div className="space-y-4">

            {orders
              .filter((o) => o.status === col.title)
              .map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-white/10 bg-black/30 p-4 transition hover:border-yellow-500/40"
                >

                  <div className="flex items-center justify-between">

                    <h3 className="font-semibold text-yellow-400">
                      {order.id}
                    </h3>

                    <span className="text-xs text-zinc-500">
                      {order.time}
                    </span>

                  </div>

                  <p className="mt-3 text-white">
                    {order.item}
                  </p>

                  <p className="mt-2 text-sm text-zinc-400">
                    Customer: {order.customer}
                  </p>

                </div>
              ))}

          </div>
        </div>
      ))}
    </div>
  );
}