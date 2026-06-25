"use client";

import { useMemo, useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
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
import ScrollToggleButton from "@/components/dashboard/flotable-button";
import { useAllMenuCategories } from "@/hooks/admin/menu-category/getAllMenuCategories";
import { useAllMenuItems } from "@/hooks/admin/menu-item/getAllMenuItems";
import { TMenuItem } from "@/lib/types/menu-item.types";
import { TMenuCategory } from "@/lib/types/menu-category.types";

export default function PublicItemsViewPage() {

  const { data: menuCategories } = useAllMenuCategories({});
  const mockCategories = menuCategories?.data ?? [];

  const { data: menuData } = useAllMenuItems({});
  const menuItems = menuData?.data ?? [];

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

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

  return (
    <div id="search" className="space-y-6 p-8">
      <DashboardHeader
        title="Menu"
        description="All the items listed here are available but it may not match exactly as shown"
      />
      <div
        className="flex flex-col gap-6"
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
                  className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                  {filteredAvailableMenuItems.map((menuItem: TMenuItem) => (
                    <div
                      key={menuItem._id}
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
                              {menuItem.status.charAt(0).toUpperCase() +
                                menuItem.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

