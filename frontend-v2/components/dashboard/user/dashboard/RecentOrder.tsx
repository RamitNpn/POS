import { Search } from "lucide-react";
import OrderItem from "./OrderItem";

const orders = Array.from({ length: 5 }).map((_, index) => ({
  id: index,
  name: "Amrit Raj",
  items: 8,
  table: 3,
  status: "Ready",
}));

export default function RecentOrders() {
  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <h3 className="text-xl font-bold">
          Recent Orders
        </h3>

        <button className="text-blue-500 text-sm font-medium hover:underline">
          View all
        </button>

      </div>

      <div className="relative">

        <Search
          className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            w-4
            h-4
            text-gray-500
          "
        />

        <input
          type="text"
          placeholder="Search recent orders"
          className="
            w-full
            bg-transparent
            py-2
            pl-10
            text-sm
            text-gray-400
            focus:outline-none
          "
        />

      </div>

      <div className="space-y-4">

        {orders.map((order) => (
          <OrderItem key={order.id} {...order} />
        ))}

      </div>

    </div>
  );
}