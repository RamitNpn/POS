import { AppRouteQueryImplementation } from "@ts-rest/express";
import orderRepository from "../../repository/order.repository";
import { statsContract } from "../../contract/stats/stats.contract";
import tableRepository from "../../repository/table.repository";
import reservationRepository from "../../repository/reservation.repository";
import expensesRepository from "../../repository/expenses.repository";
import ticketRepository from "../../repository/ticket.repository";

export const getDashboardStats: AppRouteQueryImplementation<
  typeof statsContract.getDashboardStats
> = async () => {
  console.log("[getDashboardStats] start");

  const stats = await orderRepository.getDashboardStats();
  console.log("[getDashboardStats] raw stats:", stats);

  const currentRevenue = stats.currentMonth.totalRevenue;
  const previousRevenue = stats.previousMonth.totalRevenue;
  const totalOrders = stats.currentMonth.totalOrders;
  const previousOrders = stats.previousMonth.totalOrders;

  console.log("[getDashboardStats] extracted values:", {
    currentRevenue,
    previousRevenue,
    totalOrders,
    previousOrders,
  });

  const revenueChange =
    previousRevenue > 0
      ? Number(
          (
            ((currentRevenue - previousRevenue) / previousRevenue) *
            100
          ).toFixed(2),
        )
      : 0;

  const ordersChange =
    previousOrders > 0
      ? Number(
          (((totalOrders - previousOrders) / previousOrders) * 100).toFixed(2),
        )
      : 0;

  console.log("[getDashboardStats] computed:", {
    revenueChange,
    ordersChange,
  });

  return {
    status: 200,
    body: {
      data: {
        totalRevenue: currentRevenue,
        revenueChange,
        totalOrders,
        ordersChange,
        averageOrderValue: totalOrders > 0 ? currentRevenue / totalOrders : 0,
        activeOrders: stats.activeOrders,
      },
    },
  };
};

export const getTableStats: AppRouteQueryImplementation<
  typeof statsContract.getTableStats
> = async () => {
  console.log("[getTableStats] start");

  const stats = await tableRepository.getTableStats();
  console.log("[getTableStats] raw stats:", stats);

  return {
    status: 200,
    body: {
      data: {
        total: stats.total,
        available: stats.available,
        occupied: stats.occupied,
        reserved: stats.reserved,
      },
    },
  };
};

export const getRevenueChart: AppRouteQueryImplementation<
  typeof statsContract.getRevenueChart
> = async ({ query }) => {
  console.log("[getRevenueChart] period:", query.period);

  const data = await orderRepository.getRevenueChart(query.period);
  console.log("[getRevenueChart] raw data length:", data.length);

  const mapped = data.map((item) => ({
    date: item._id,
    revenue: item.revenue,
    orders: item.orders,
  }));

  console.log("[getRevenueChart] mapped sample:", mapped.slice(0, 3));

  return {
    status: 200,
    body: {
      success: true,
      data: mapped,
    },
  };
};

export const getRevenueStats: AppRouteQueryImplementation<
  typeof statsContract.getRevenueStats
> = async () => {
  try {
    console.log("[getRevenueStats] start");

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    console.log("[getRevenueStats] date range:", {
      startOfToday,
      endOfToday,
    });

    const ordersResult = await orderRepository.getAll({
      skip: 0,
      limit: 1000,
    });

    console.log(
      "[getRevenueStats] total orders fetched:",
      ordersResult.data.length,
    );

    const orders = ordersResult.data;

    const todayOrders = orders.filter((order) => {
      const d = new Date(order.createdAt);
      return d >= startOfToday && d <= endOfToday;
    });

    console.log("[getRevenueStats] today orders:", todayOrders.length);

    const totalRevenue = todayOrders.reduce((sum, order) => {
      if (order.paymentStatus === "paid") {
        return sum + (order.subtotal || 0);
      }
      return sum;
    }, 0);

    console.log("[getRevenueStats] totalRevenue:", totalRevenue);

    const reservationsResult = await reservationRepository.getAll({
      skip: 0,
      limit: 1000,
    });

    console.log(
      "[getRevenueStats] reservations fetched:",
      reservationsResult.data.length,
    );

    const reservations = reservationsResult.data;

    const reservationsToday = reservations.filter((r) => {
      const d = new Date(r.createdAt);
      return d >= startOfToday && d <= endOfToday;
    });

    console.log(
      "[getRevenueStats] reservations today:",
      reservationsToday.length,
    );

    return {
      status: 200,
      body: {
        data: {
          totalRevenue,
          todayOrders: todayOrders.length,
          reservationsToday: reservationsToday.length,
        },
      },
    };
  } catch (error) {
    console.error("[getRevenueStats] error:", error);
    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const getProfitLossStats: AppRouteQueryImplementation<
  typeof statsContract.getProfitLossStats
> = async ({ req }) => {
  try {
    console.log("[getProfitLossStats] start");

    const period = req.query.period ?? "30d";
    console.log("[getProfitLossStats] period:", period);

    const now = new Date();
    const start = new Date();

    const mapPeriod: Record<string, number> = {
      today: 1,
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "1y": 365,
      all: 3650,
    };

    start.setDate(now.getDate() - mapPeriod[period]);

    console.log("[getProfitLossStats] date range:", { start, now });

    const ordersRes = await orderRepository.getAll({
      skip: 0,
      limit: 10000,
    });

    console.log("[getProfitLossStats] orders fetched:", ordersRes.data.length);

    const orders = ordersRes.data.filter((o) => {
      const d = new Date(o.createdAt);
      return d >= start && d <= now;
    });

    console.log("[getProfitLossStats] filtered orders:", orders.length);

    const expensesRes = await expensesRepository.getAll({
      skip: 0,
      limit: 10000,
    });

    console.log("[getProfitLossStats] raw expenses:", expensesRes.data.length);

    const expenses = expensesRes.data.filter((e) => {
      const d = new Date(e.date);
      return d >= start && d <= now;
    });

    console.log("[getProfitLossStats] filtered expenses:", expenses.length);

    const totalRevenue = orders.reduce((sum, o) => {
      if (o.status === "completed") {
        return sum + (o.subtotal ?? 0);
      }
      return sum;
    }, 0);

    console.log("[getProfitLossStats] totalRevenue:", totalRevenue);

    const totalExpenses = expenses.reduce((sum, e) => {
      const amount = Number(e.amount ?? 0);
      return sum + amount;
    }, 0);

    console.log("[getProfitLossStats] totalExpenses:", totalExpenses);

    const profit = Math.max(totalRevenue - totalExpenses, 0);
    const loss = Math.max(totalExpenses - totalRevenue, 0);
    const netProfit = totalRevenue - totalExpenses;

    console.log("[getProfitLossStats] profit metrics:", {
      profit,
      loss,
      netProfit,
    });

    const seriesMap = new Map<
      string,
      { revenue: number; expense: number; orders: number }
    >();

    const formatKey = (d: Date) => d.toISOString().split("T")[0];

    for (const o of orders) {
      if (o.status !== "completed") continue;

      const key = formatKey(new Date(o.createdAt));

      const prev = seriesMap.get(key) || {
        revenue: 0,
        expense: 0,
        orders: 0,
      };

      prev.revenue += o.subtotal ?? 0;
      prev.orders += 1;

      seriesMap.set(key, prev);
    }

    for (const e of expenses) {
      const key = formatKey(new Date(e.date));
      const prev = seriesMap.get(key) || { revenue: 0, expense: 0, orders: 0 };

      const amount = Number(e.amount ?? 0);
      prev.expense += amount;

      seriesMap.set(key, prev);
    }

    const revenueSeries = Array.from(seriesMap.entries()).map(
      ([date, val]) => ({
        date,
        revenue: val.revenue,
        expense: val.expense,
        profit: val.revenue - val.expense,
        totalOrders: val.orders,
      }),
    );

    console.log(
      "[getProfitLossStats] series sample:",
      revenueSeries.slice(0, 3),
    );

    return {
      status: 200,
      body: {
        data: {
          totalRevenue,
          totalExpenses,
          profit,
          loss,
          netProfit,
          ordersCount: orders.length,
          expensesCount: expenses.length,
          revenueSeries,
        },
      },
    };
  } catch (error) {
    console.error("[getProfitLossStats] error:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const getCashierCheckoutStats: AppRouteQueryImplementation<
  typeof statsContract.cashierCheckoutStats
> = async () => {
  try {
    const [totalActiveOrders, readyForCheckout, pendingPayments, tableStats] =
      await Promise.all([
        ticketRepository.count({
          status: {
            $in: ["pending", "served"],
          },
        }),

        orderRepository.count({
          status: "completed",
          paymentStatus: {
            $ne: "paid",
          },
        }),

        orderRepository.count({
          paymentStatus: {
            $ne: "paid",
          },
        }),

        tableRepository.getTableStats(),
      ]);

    return {
      status: 200,
      body: {
        success: true,
        data: {
          totalActiveOrders,
          readyForCheckout,
          pendingPayments,
          tablesInHouse: tableStats.total,
        },
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch cashier checkout stats",
      },
    };
  }
};

export const statsQueryHandler = {
  getDashboardStats,
  getTableStats,
  getRevenueChart,
  getRevenueStats,
  getProfitLossStats,
  getCashierCheckoutStats,
};
