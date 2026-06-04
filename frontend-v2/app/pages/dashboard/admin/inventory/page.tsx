"use client";

import AddCategoryModal from "@/components/dashboard/admin/inventory/AddCategoryModal";
import InventoryCategoryGrid from "@/components/dashboard/admin/inventory/CategoryGrid";
import InventoryStats from "@/components/dashboard/admin/inventory/InventoryStats";
import InventoryTabs from "@/components/dashboard/admin/inventory/InventoryTabs";

export default function InventoryPage() {
  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Inventory Management
          </h1>
          <p className="text-zinc-400 text-sm mt-2">
            Manage food categories, stock & menu items
          </p>
        </div>
        <AddCategoryModal />
      </div>

      <InventoryStats />

      <InventoryCategoryGrid />

      <InventoryTabs />

    </div>
  );
}