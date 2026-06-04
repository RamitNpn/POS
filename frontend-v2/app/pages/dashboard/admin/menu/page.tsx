"use client";

import AddItemModal from "@/components/dashboard/admin/inventory/AddItemModal";
import CategoryGrid from "@/components/dashboard/admin/menu/CategoryGrid";
import MenuStats from "@/components/dashboard/admin/menu/MenuStats";
import MenuTabs from "@/components/dashboard/admin/menu/MenuTabs";

export default function MenuPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Food Menu Management
          </h1>
          <p className="text-sm text-zinc-400 mt-2">
            Manage dishes, categories, stock & pricing
          </p>
        </div>
        <AddItemModal />
      </div>

      <MenuStats />

      <CategoryGrid />

      <MenuTabs />
    </div>
  );
}
