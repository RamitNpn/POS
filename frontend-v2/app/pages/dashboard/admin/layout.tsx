import Header from "@/components/layout/admin/Header";
import Sidebar from "@/components/layout/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-[#0b0b0b] text-white min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6 bg-[#0b0b0b] h-[90vh] overflow-y-scroll">
          {children}
        </main>
      </div>
    </div>
  );
}