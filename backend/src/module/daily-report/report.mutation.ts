import { AppRouteMutationImplementation } from "@ts-rest/express";
import { reportContract } from "../../contract/daily-report/report.contract";
import { dailyReportRepository } from "../../repository/report.repository";
import OrderModel from "../../model/order.model";

export const generateDailyReport: AppRouteMutationImplementation<
  typeof reportContract.generateDailyReport
> = async () => {
  const start = new Date();

  console.log("[DAILY REPORT] START INIT:", start);

  start.setDate(start.getDate() - 1);
  start.setHours(0, 0, 0, 0);

  console.log("[DAILY REPORT] REPORT START DATE:", start);

  const end = new Date(start);
  end.setHours(23, 59, 59, 999);

  console.log("[DAILY REPORT] REPORT END DATE:", end);

  try {
    const existing = await dailyReportRepository.getByDate(start);

    console.log("[DAILY REPORT] EXISTING REPORT:", existing);

    if (existing) {
      console.log("[DAILY REPORT] SKIPPED - REPORT ALREADY EXISTS");

      return {
        status: 200,
        body: {
          success: true,
          message: "Report already exists.",
        },
      };
    }

    console.log("[DAILY REPORT] FETCHING ORDERS...");

    const orders = await OrderModel.find({
      status: "completed",
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });

    console.log("[DAILY REPORT] ORDERS FOUND:", {
      count: orders.length,
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    const totalOrders = orders.length;

    console.log("[DAILY REPORT] CALCULATED METRICS:", {
      totalRevenue,
      totalOrders,
    });

    console.log("[DAILY REPORT] CREATING REPORT IN DB...");

    await dailyReportRepository.create({
      reportDate: start,
      totalRevenue,
      totalOrders,
      cashSales: 0,
      onlineSales: 0,
      totalDiscount: 0,
      totalTax: 0,
    });

    console.log("[DAILY REPORT] REPORT CREATED SUCCESSFULLY");

    return {
      status: 200,
      body: {
        success: true,
        message: "Daily report generated.",
      },
    };
  } catch (error) {
    console.error("[DAILY REPORT] ERROR:", error);
    console.error("[DAILY REPORT] DATE RANGE:", { start, end });

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to generate daily report",
      },
    };
  }
};

export const reportMutationHandler = {
  generateDailyReport,
};
