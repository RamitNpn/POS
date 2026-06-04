"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import OrderAnalytics from "./OrderAnalytics";
import InventoryTable from "./InventoryTable";
import OrderLogs from "./OrderLogs";

export default function OrderTabs() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#141414] p-6">
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
          <OrderAnalytics />
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <OrderLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
}
