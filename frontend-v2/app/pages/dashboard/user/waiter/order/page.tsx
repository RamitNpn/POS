import FilterTabs from "@/components/dashboard/user/order/FilterTab";
import OrdersGrid from "@/components/dashboard/user/order/OrderGrid";
import OrdersHeader from "@/components/dashboard/user/order/OrderHeaders";

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <OrdersHeader />
        <FilterTabs />
      </div>
      <OrdersGrid />
    </div>
  );
}
