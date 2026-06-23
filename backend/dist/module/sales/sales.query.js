"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesQueryHandler = exports.getTopSellingItems = exports.getSalesAnalytics = void 0;
const order_model_1 = __importDefault(require("../../model/order.model"));
const order_repository_1 = __importDefault(require("../../repository/order.repository"));
const getSalesAnalytics = async ({ req }) => {
    try {
        const query = {
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
        const orders = await order_model_1.default.find(query).populate({
            path: "items.menuItemId",
            populate: {
                path: "categoryId",
            },
        });
        let totalRevenue = 0;
        const categoryMap = new Map();
        orders.forEach((order) => {
            totalRevenue += order.total;
            order.items.forEach((item) => {
                const menuItem = item.menuItemId;
                if (!menuItem?.categoryId)
                    return;
                const categoryName = menuItem.categoryId.name;
                const itemRevenue = item.price * item.quantity;
                categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + itemRevenue);
            });
        });
        const salesByCategory = Array.from(categoryMap.entries()).map(([category, sales]) => ({
            category,
            sales,
            percentage: totalRevenue > 0 ? (sales / totalRevenue) * 100 : 0,
        }));
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
    }
    catch {
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to fetch sales analytics",
            },
        };
    }
};
exports.getSalesAnalytics = getSalesAnalytics;
const getTopSellingItems = async () => {
    try {
        const orders = await order_repository_1.default
            .getActiveOrders();
        const itemMap = new Map();
        orders.forEach((order) => {
            order.items.forEach((item) => {
                const existing = itemMap.get(item.menuItemId.toString());
                if (existing) {
                    existing.quantity += item.quantity;
                    existing.revenue +=
                        item.quantity * item.price;
                }
                else {
                    itemMap.set(item.menuItemId.toString(), {
                        menuItemId: item.menuItemId.toString(),
                        name: item.name,
                        quantity: item.quantity,
                        revenue: item.quantity * item.price,
                    });
                }
            });
        });
        const items = Array.from(itemMap.values()).sort((a, b) => b.quantity - a.quantity);
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
    }
    catch {
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to fetch top selling items",
            },
        };
    }
};
exports.getTopSellingItems = getTopSellingItems;
exports.salesQueryHandler = {
    getSalesAnalytics: exports.getSalesAnalytics,
    getTopSellingItems: exports.getTopSellingItems,
};
