"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { api } from "@/lib/api/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import type { MenuCategory, MenuItem } from "@/lib/types";
import { ArrowDown, ArrowUp } from "lucide-react";

export const mockCategories: MenuCategory[] = [
  {
    id: "cat-1",
    name: "Appetizers",
    description: "Start your meal right",
    sortOrder: 1,
    isActive: true,
    itemCount: 5,
  },
  {
    id: "cat-2",
    name: "Main Course",
    description: "Signature dishes",
    sortOrder: 2,
    isActive: true,
    itemCount: 8,
  },
  {
    id: "cat-3",
    name: "Pasta",
    description: "Fresh homemade pasta",
    sortOrder: 3,
    isActive: true,
    itemCount: 6,
  },
  {
    id: "cat-4",
    name: "Desserts",
    description: "Sweet endings",
    sortOrder: 4,
    isActive: true,
    itemCount: 4,
  },
  {
    id: "cat-5",
    name: "Beverages",
    description: "Drinks and cocktails",
    sortOrder: 5,
    isActive: true,
    itemCount: 10,
  },
  {
    id: "cat-6",
    name: "Salads",
    description: "Fresh and healthy",
    sortOrder: 6,
    isActive: true,
    itemCount: 4,
  },
];

export default function WaiterMenuPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const tableId = searchParams.get("tableId");

  const { data: tables } = useQuery({
    queryKey: ["tables"],
    queryFn: api.getTables,
  });

  const { data: menuItems } = useQuery({
    queryKey: ["menu-items"],
    queryFn: api.getMenuItems,
  });

  const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const selectedTable = useMemo(
    () => tables?.find((table) => table.id === tableId),
    [tables, tableId],
  );

  const enrichedMenuItems = useMemo(() => {
    return (menuItems ?? []).map((item) => ({
      ...item,
      category: mockCategories.find((c) => c.id === item.categoryId),
    }));
  }, [menuItems]);

  const availableMenuItems = useMemo(
    () => enrichedMenuItems.filter((item) => item.isAvailable),
    [enrichedMenuItems],
  );

  const filteredAvailableMenuItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    return availableMenuItems.filter((item) => {
      const matchesSearch =
        term === "" ||
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        (item.category?.name ?? "").toLowerCase().includes(term);
      const matchesCategory =
        categoryFilter === "all" || item.category?.id === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [availableMenuItems, search, categoryFilter]);

  const selectedItems = useMemo(
    () =>
      availableMenuItems.filter(
        (menuItem) => (quantities[menuItem.id] ?? 0) > 0,
      ),
    [availableMenuItems, quantities],
  );

  const subtotal = selectedItems.reduce(
    (sum, menuItem) => sum + menuItem.price * (quantities[menuItem.id] ?? 0),
    0,
  );

  const tax = Number((subtotal * 0.1).toFixed(2));
  const total = subtotal + tax;

  const createOrderMutation = useMutation({
    mutationFn: api.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-orders"] });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      toast({
        title: "Order created",
        description: `Order has been sent to kitchen for Table ${selectedTable?.number}.`,
      });
      router.push("/dashboard/waiter/orders");
    },
    onError: () => {
      toast({
        title: "Unable to create order",
        description: "Please try again or select a different table.",
      });
    },
  });

  const increaseQuantity = (menuItem: MenuItem) => {
    setQuantities((current) => ({
      ...current,
      [menuItem.id]: (current[menuItem.id] ?? 0) + 1,
    }));
  };

  const decreaseQuantity = (menuItem: MenuItem) => {
    setQuantities((current) => {
      const nextCount = (current[menuItem.id] ?? 0) - 1;
      if (nextCount <= 0) {
        const { [menuItem.id]: _, ...rest } = current;
        return rest;
      }
      return { ...current, [menuItem.id]: nextCount };
    });
  };

  const handleCreateOrder = () => {
    if (!selectedTable || selectedTable.status !== "available") {
      toast({
        title: "Select a table",
        description:
          "Please open the waiter dashboard and choose an available table first.",
      });
      return;
    }

    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Choose at least one menu item before creating the order.",
      });
      return;
    }

    const orderItems = selectedItems.map((menuItem) => ({
      id: `order-item-${menuItem.id}-${Date.now()}`,
      menuItemId: menuItem.id,
      menuItem,
      quantity: quantities[menuItem.id] ?? 1,
      price: menuItem.price,
      status: "pending" as const,
    }));

    createOrderMutation.mutate({
      tableId: selectedTable.id,
      items: orderItems,
      status: "pending",
      paymentStatus: "pending",
      subtotal,
      tax,
      total,
      notes,
      waiterId: "2",
    });
  };

  return (
    <div id="search" className="space-y-6">
      <DashboardHeader
        title="Menu"
        description={`Creating order for Table #${selectedTable?.number || ""} ${selectedTable?.section || ""}`}
      />

      <div
        className={`${selectedTable ? "grid gap-6 xl:grid-cols-[1.6fr_1fr]" : "flex flex-col gap-6"}`}
      >
        <div className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Menu items</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="md:flex gap-2 md:items-center grid md:grid-cols-[1fr_auto]">
                <Input
                  className="flex-1"
                  placeholder="Search menu items..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Select
                  value={categoryFilter}
                  onValueChange={(v) => setCategoryFilter(v)}
                >
                  <SelectTrigger className="md:w-44 w-auto">
                    <SelectValue>
                      {categoryFilter === "all"
                        ? "All categories"
                        : mockCategories.find((c) => c.id === categoryFilter)
                            ?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {mockCategories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="">
                  <a
                    href="#checkout"
                    className="lg:hidden text-primary text-sm font-medium bg-primary/10 px-3 py-2 rounded-full flex items-center gap-1"
                  >
                    Invoice
                    <ArrowDown className="size-3" />
                  </a>
                </div>
              </div>
              {filteredAvailableMenuItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No menu items match your search.
                </p>
              ) : (
                <div
                  className={`grid gap-4 ${selectedTable ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}`}
                >
                  {filteredAvailableMenuItems.map((menuItem) => (
                    <div
                      key={menuItem.id}
                      className="rounded-3xl border border-border p-4 flex flex-col"
                    >
                      <div className="mb-3 overflow-hidden rounded-md">
                        <img
                          src={menuItem.image ?? "/placeholder.jpg"}
                          alt={menuItem.name}
                          className="w-full h-40 object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {menuItem.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {menuItem.description}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline">
                              Rs {menuItem.price.toFixed(2)}
                            </Badge>
                            <Badge variant="outline">
                              {menuItem.category?.name}
                            </Badge>
                          </div>
                        </div>
                        {selectedTable && (
                          <div className="mt-3 flex items-center justify-center gap-2 rounded-md border border-border bg-muted/20 px-3 py-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => decreaseQuantity(menuItem)}
                            >
                              -
                            </Button>
                            <span className="min-w-6 text-center text-sm font-semibold">
                              {quantities[menuItem.id] ?? 0}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => increaseQuantity(menuItem)}
                            >
                              +
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {selectedItems && selectedTable && (
          <div id="checkout" className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Order summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 rounded-3xl border border-border bg-muted/50 p-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Table</span>
                    <span>{selectedTable?.number}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Section</span>
                    <span>{selectedTable?.section}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Status</span>
                    <span className="capitalize">{selectedTable?.status}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No items selected yet.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-muted-foreground">
                            {item.name} x {quantities[item.id]}
                          </span>
                          <span className="text-sm font-semibold text-foreground">
                            Rs{" "}
                            {(item.price * (quantities[item.id] ?? 0)).toFixed(
                              2,
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rs {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>Rs {tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-foreground">
                    <span>Total</span>
                    <span>Rs {total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer-name">Customer Name</Label>
                  <Input
                    id="customer-name"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Enter customer name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order-notes">Order notes</Label>
                  <Textarea
                    className="resize-none"
                    id="order-notes"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Add special requests or instructions"
                    rows={4}
                  />
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleCreateOrder}
                  disabled={
                    createOrderMutation.isPending || selectedItems.length === 0
                  }
                >
                  {createOrderMutation.isPending
                    ? "Sending to Kitchen..."
                    : "Create Order"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
