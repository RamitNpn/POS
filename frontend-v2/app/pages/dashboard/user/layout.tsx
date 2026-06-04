import BottomNav from "@/components/layout/user/BottomNavigation";
import TopNavbar from "@/components/layout/user/TopNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#121212] text-white pb-24">
      <TopNavbar />

      <main className="max-w-[1440px] mx-auto px-8 mt-4">{children}</main>

      <BottomNav />
    </div>
  );
}
