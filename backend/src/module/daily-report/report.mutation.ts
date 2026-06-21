import { AppRouteMutationImplementation } from "@ts-rest/express";
import { reportContract } from "../../contract/daily-report/report.contract";
import { dailyReportRepository } from "../../repository/report.repository";
import OrderModel from "../../model/order.model";

export const generateDailyReport: AppRouteMutationImplementation<
  typeof reportContract.generateDailyReport
> = async () => {
  const start = new Date();

  start.setDate(start.getDate() - 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setHours(23, 59, 59, 999);

  const existing = await dailyReportRepository.getByDate(start);

  if (existing) {
    return {
      status: 200,
      body: {
        success: true,
        message: "Report already exists.",
      },
    };
  }

  const orders = await OrderModel.find({
    status: "completed",

    createdAt: {
      $gte: start,
      $lte: end,
    },
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  const totalOrders = orders.length;

  await dailyReportRepository.create({
    reportDate: start,

    totalRevenue,
    totalOrders,

    cashSales: 0,
    onlineSales: 0,

    totalDiscount: 0,
    totalTax: 0,
  });

  return {
    status: 200,
    body: {
      success: true,
      message: "Daily report generated.",
    },
  };
};

export const reportMutationHandler = {
  generateDailyReport,
};