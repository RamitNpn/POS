import OrderCard from "./OrderCard";

const orders = Array.from({
  length: 9,
}).map((_, i) => ({
  id: i + 1,
  customer: "Amrit Raj",
  orderId: `10${i + 1}`,
  type: "Dine In",
  status: "Ready",
  statusText: "Ready to serve",
  items: 8,
  amount: 250,
  date: "January 18, 2025 08:32 PM",
}));

export default function OrdersGrid() {
  return (
    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        gap-6
      "
    >
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          {...order}
        />
      ))}
    </div>
  );
}