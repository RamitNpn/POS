import { AppRouteQueryImplementation } from "@ts-rest/express";

import { salesContract } from "../../contract/sales/sales.contract";
import OrderModel from "../../model/order.model";
import orderRepository from "../../repository/order.repository";

export const getSalesAnalytics: AppRouteQueryImplementation<
  typeof salesContract.getSalesAnalytics
> = async ({ req }) => {
  try {
    console.log("[getSalesAnalytics] req.query:", req.query);

    const query: any = {
      paymentStatus: "paid",
    };

    if (req.query.fromDate || req.query.toDate) {
      query.createdAt = {};
    }

    if (req.query.fromDate) {
      query.createdAt.$gte = new Date(req.query.fromDate);
    }

    if (req.query.toDate) {
      query.createdAt.$lte = new Date(req.query.toDate);
    }

    console.log("[getSalesAnalytics] mongo query:", query);

    const orders = await OrderModel.find(query).populate({
      path: "items.menuItemId",
      populate: {
        path: "categoryId",
      },
    });

    console.log("[getSalesAnalytics] orders found:", orders.length);

    let totalRevenue = 0;

    const categoryMap = new Map<string, number>();

    orders.forEach((order) => {
      console.log("[getSalesAnalytics] processing order:", order._id);

      totalRevenue += order.total;

      order.items.forEach((item: any) => {
        const menuItem = item.menuItemId;

        if (!menuItem?.categoryId) {
          console.log("[getSalesAnalytics] missing category:", item);
          return;
        }

        const categoryName = menuItem.categoryId.name;
        const itemRevenue = item.price * item.quantity;

        console.log("[getSalesAnalytics] item revenue:", {
          categoryName,
          itemRevenue,
        });

        categoryMap.set(
          categoryName,
          (categoryMap.get(categoryName) || 0) + itemRevenue,
        );
      });
    });

    const salesByCategory = Array.from(categoryMap.entries()).map(
      ([category, sales]) => ({
        category,
        sales,
        percentage: totalRevenue > 0 ? (sales / totalRevenue) * 100 : 0,
      }),
    );

    console.log("[getSalesAnalytics] salesByCategory:", salesByCategory);

    salesByCategory.sort((a, b) => b.sales - a.sales);

    return {
      status: 200,
      body: {
        totalRevenue,
        totalCategories: salesByCategory.length,
        topCategory: salesByCategory[0]?.category ?? null,
        salesByCategory,
      },
    };
  } catch (error) {
    console.error("[getSalesAnalytics] ERROR:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch sales analytics",
      },
    };
  }
};

export const getTopSellingItems: AppRouteQueryImplementation<
  typeof salesContract.getTopSellingItems
> = async () => {
  try {
    console.log("[getTopSellingItems] fetching active orders");

    const orders = await orderRepository.getActiveOrders();

    console.log("[getTopSellingItems] orders:", orders.length);

    const itemMap = new Map();

    orders.forEach((order: any) => {
      console.log("[getTopSellingItems] order:", order._id);

      order.items.forEach((item: any) => {
        const key = item.menuItemId.toString();

        const existing = itemMap.get(key);

        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.quantity * item.price;

          console.log("[getTopSellingItems] updated item:", existing);
        } else {
          const newItem = {
            menuItemId: key,
            name: item.name,
            quantity: item.quantity,
            revenue: item.quantity * item.price,
          };

          itemMap.set(key, newItem);

          console.log("[getTopSellingItems] new item:", newItem);
        }
      });
    });

    const items = Array.from(itemMap.values()).sort(
      (a, b) => b.quantity - a.quantity,
    );

    console.log("[getTopSellingItems] sorted items:", items);

    const topItem = items[0];

    return {
      status: 200,
      body: {
        topItem: topItem?.name ?? "",
        topRevenue: topItem?.revenue ?? 0,
        totalItems: items.length,
        items,
      },
    };
  } catch (error) {
    console.error("[getTopSellingItems] ERROR:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch top selling items",
      },
    };
  }
};

export const salesQueryHandler = {
  getSalesAnalytics,
  getTopSellingItems,
};