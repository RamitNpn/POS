import { apiClient } from "@/utils/apiClient";

export const getDashboardStats = async () => {
  const res = await apiClient.get("/stats/dashboard");
  return res.data;
};

export const getTableStats = async () => {
  const res = await apiClient.get("/stats/table");
  return res.data;
};

export const getRevenueAnalytic = async (period: string) => {
  const res = await apiClient.get("/stats/revenue-chart", {
    params: {
      period,
    },
  });
  return res.data;
};

export const getRevenueStats = async () => {
  const res = await apiClient.get("/stats/revenue");
  return res.data;
};

export const getProfitLossStatsApi = async (period: string) => {
  const res = await apiClient.get("/stats/profit-loss", {
    params: {
      period,
    },
  });
  return res.data;
};

export const getCashierDashboardStats = async () => {
  const res = await apiClient.get("/stats/cashier-checkout");
  return res.data;
};

export const statsApi = {
  getDashboardStats,
  getTableStats,
  getRevenueAnalytic,
  getRevenueStats,
  getProfitLossStatsApi,
  getCashierDashboardStats,
};
