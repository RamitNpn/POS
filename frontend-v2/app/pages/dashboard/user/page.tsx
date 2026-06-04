import GreetingSection from "@/components/dashboard/user/dashboard/GreetingSection";
import PopularDishes from "@/components/dashboard/user/dashboard/PopularDishes";
import RecentOrders from "@/components/dashboard/user/dashboard/RecentOrder";
import StatCard from "@/components/dashboard/user/dashboard/StatCard";
import { Wallet, Clock3 } from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="max-w-[1440px] mx-auto px-8 mt-4">
      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-12 lg:col-span-8 space-y-8">
          <GreetingSection />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              title="Total Earnings"
              value="₹512"
              percentage="1.6%"
              description="than yesterday"
              icon={<Wallet size={24} />}
              iconBg="bg-green-500/10"
              iconColor="text-green-500"
            />

            <StatCard
              title="In Progress"
              value="16"
              percentage="3.6%"
              description="than yesterday"
              icon={<Clock3 size={24} />}
              iconBg="bg-yellow-500/10"
              iconColor="text-yellow-500"
            />
          </div>

          <RecentOrders />
        </section>

        <aside className="col-span-12 lg:col-span-4">
          <PopularDishes />
        </aside>
      </div>
    </main>
  );
}
