"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/layout/dashboard-header";
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
import { useAllMenuCategories } from "@/hooks/admin/menu-category/getAllMenuCategories";
import { TMenuCategory } from "@/lib/types/menu-category.types";
import { useTableById } from "@/hooks/admin/table/getTableById";
import { useAllMenuItems } from "@/hooks/admin/menu-item/getAllMenuItems";
import { TMenuItem } from "@/lib/types/menu-item.types";
import { useForm } from "react-hook-form";
import { orderApi } from "@/lib/api/order.api";
import { useAuth } from "@/context/auth-context";
import ScrollToggleButton from "@/components/dashboard/flotable-button";
import Image from "next/image";

export default function WaiterMenuPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const tableId = searchParams.get("tableId");

  const { data: selectedTable } = useTableById(tableId || "");
  const { data: menuCategories } = useAllMenuCategories({});
  const mockCategories = menuCategories?.data ?? [];

  const { data: menuData } = useAllMenuItems({});
  const menuItems = menuData?.data ?? [];

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  console.log("Auth user data", user);

  const enrichedMenuItems = useMemo(() => {
    return (menuItems ?? []).map((item: TMenuItem) => ({
      ...item,
      category: mockCategories.find(
        (c: TMenuCategory) => c._id === item.categoryId,
      ),
    }));
  }, [menuItems, mockCategories]);

  const availableMenuItems = useMemo(
    () =>
      enrichedMenuItems.filter(
        (item: TMenuItem) => item.status === "available",
      ),
    [enrichedMenuItems],
  );

  const filteredAvailableMenuItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    return availableMenuItems.filter((item: TMenuItem) => {
      const matchesSearch =
        term === "" || item.name.toLowerCase().includes(term);
      const matchesCategory =
        categoryFilter === "all" || item.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [availableMenuItems, search, categoryFilter]);

  const selectedItems = useMemo(
    () =>
      availableMenuItems.filter(
        (menuItem: TMenuItem) => (quantities[menuItem._id] ?? 0) > 0,
      ),
    [availableMenuItems, quantities],
  );

  const subtotal = selectedItems.reduce(
    (sum: number, menuItem: TMenuItem) =>
      sum + menuItem.price * (quantities[menuItem._id] ?? 0),
    0,
  );

  const tax = Number((subtotal * 0.1).toFixed(2));
  const total = subtotal + tax;

  const orderItems = useMemo(() => {
    return selectedItems.map((item: TMenuItem) => {
      const qty = quantities[item._id] ?? 1;
      return {
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        quantity: qty,
        total: item.price * qty,
      };
    });
  }, [selectedItems, quantities]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      customerName: "",
      notes: "",
      tableId: selectedTable?._id || "",
      items: [],
    },
    values: {
      customerName: "",
      notes: "",
      tableId: selectedTable?._id || "",
      items: orderItems,
    },
  });

  const { mutate, isPending: isCreatingOrder } = useMutation({
    mutationFn: orderApi.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-orders"] });
      queryClient.invalidateQueries({ queryKey: ["tables"] });

      setQuantities({});

      toast({
        title: "Order created",
        description: `Order sent to kitchen for Table ${selectedTable?.name}.`,
      });

      router.push("/dashboard/waiter/orders");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Unable to create order",
        description:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Please try again or select another table.",
      });
    },
  });

  const increaseQuantity = (menuItem: TMenuItem) => {
    setQuantities((current) => ({
      ...current,
      [menuItem._id]: (current[menuItem._id] ?? 0) + 1,
    }));
  };

  const decreaseQuantity = (menuItem: TMenuItem) => {
    setQuantities((current) => {
      const nextCount = (current[menuItem._id] ?? 0) - 1;
      if (nextCount <= 0) {
        const { [menuItem._id]: _, ...rest } = current;
        return rest;
      }
      return { ...current, [menuItem._id]: nextCount };
    });
  };

  const onSubmit = (data: any) => {
    if (!selectedTable) {
      toast({
        title: "Select a table",
        description: "Please choose a table first.",
        variant: "destructive",
      });
      return;
    }

    if (data.items.length === 0) {
      toast({
        title: "No items selected",
        description: "Add at least one item.",
        variant: "destructive",
      });
      return;
    }

    mutate({
      tableId: data.tableId,
      customerName: data.customerName || "Guest",
      waiterId: user?.id || "",
      notes: data.notes || undefined,
      items: data.items,
    });
  };

  return (
    <div id="search" className="space-y-6">
      <DashboardHeader
        title="Menu"
        description={`Creating order for Table ${selectedTable?.name ?? ""} ${selectedTable?.section ?? ""}`}
      />

      <ScrollToggleButton targetId="checkout" />
      <div
        className={
          selectedTable
            ? "grid gap-6 xl:grid-cols-[1.6fr_1fr]"
            : "flex flex-col gap-6"
        }
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
                        : mockCategories.find(
                            (c: TMenuCategory) => c._id === categoryFilter,
                          )?.name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {mockCategories.map((c: TMenuCategory) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {filteredAvailableMenuItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No menu items match your search.
                </p>
              ) : (
                <div
                  className={`grid gap-4 ${selectedTable ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}`}
                >
                  {filteredAvailableMenuItems.map((menuItem: TMenuItem) => (
                    <div
                      key={menuItem._id}
                      className="rounded-3xl border border-border p-4 flex flex-col"
                    >
                      <div className="mb-3 overflow-hidden rounded-md">
                        <Image
                          src={menuItem.image ?? "/placeholder.jpg"}
                          alt={menuItem.name}
                          width={400}
                          height={250}
                          className="w-full h-40 object-cover"
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw,
         (max-width: 1200px) 50vw,
         25vw"
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
                              {menuItem.status.charAt(0).toUpperCase() +
                                menuItem.status.slice(1)}
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
                              {quantities[menuItem._id] ?? 0}
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

        {tableId && (
          <div id="checkout" className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Order summary</CardTitle>
              </CardHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2 rounded-3xl border border-border bg-muted/50 p-4">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Table</span>
                      <span>{selectedTable?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Section</span>
                      <span>{selectedTable?.section}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Status</span>
                      <span className="capitalize">
                        {selectedTable?.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {selectedItems.map((item: TMenuItem) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-muted-foreground">
                          {item.name} x {quantities[item._id]}
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          Rs{" "}
                          {(item.price * (quantities[item._id] ?? 0)).toFixed(
                            2,
                          )}
                        </span>
                      </div>
                    ))}
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
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input
                      id="customerName"
                      {...register("customerName")}
                      placeholder="Enter customer name"
                    />
                    {errors.customerName && (
                      <p className="text-xs text-destructive">
                        {errors.customerName.message?.toString()}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Order notes</Label>
                    <Textarea
                      id="notes"
                      {...register("notes")}
                      placeholder="Add special requests or instructions"
                      rows={4}
                    />
                    {errors.notes && (
                      <p className="text-xs text-destructive">
                        {errors.notes.message?.toString()}
                      </p>
                    )}
                  </div>

                  {/* 3. Added helpful error alerts at bottom if anything fails schema rules */}
                  {Object.keys(errors).length > 0 && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-xs space-y-1">
                      <p className="font-semibold">Something went wrong:</p>
                      {errors.tableId && <p>• Table selection is missing.</p>}
                      {errors.items && (
                        <p>• You must add menu items to the order.</p>
                      )}
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isCreatingOrder}
                  >
                    {isCreatingOrder ? "Creating..." : "Create Order"}
                  </Button>
                </CardContent>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
