"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InventoryTable from "./InventoryTable";
import InventoryAnalytics from "./InventoryAnalytics";
import InventoryLogs from "./InventoryLogs";

export default function InventoryTabs() {
  return (
    <div className="bg-[#141414] border border-white/10 p-6 rounded-2xl">
      <Tabs defaultValue="inventory">
        <TabsList className="grid w-full grid-cols-3 bg-[#0f0f0f] border border-white/10">
          <TabsTrigger
            value="inventory"
            className="text-white hover:text-none data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
          >
            Inventory
          </TabsTrigger>

          <TabsTrigger
            value="analytics"
            className="text-white hover:text-none data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
          >
            Analytics
          </TabsTrigger>

          <TabsTrigger
            value="logs"
            className="text-white hover:text-none data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
          >
            Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="mt-6">
          <InventoryTable />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <InventoryAnalytics />
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <InventoryLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
}
