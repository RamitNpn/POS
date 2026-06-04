import KitchenBoard from "@/components/dashboard/user/kitchen/KitchenBoard";
import KitchenHeader from "@/components/dashboard/user/kitchen/KitchenHeader";

export default function KitchenPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white px-4 sm:px-6 pb-28">
      <KitchenHeader />
      <KitchenBoard />
    </div>
  );
}