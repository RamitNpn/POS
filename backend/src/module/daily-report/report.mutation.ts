import { AppRouteMutationImplementation } from "@ts-rest/express";
import { reportContract } from "../../contract/daily-report/report.contract";
import { dailyReportRepository } from "../../repository/report.repository";
import OrderModel from "../../model/order.model";
import logRepository from "../../repository/log.repository";
import mongoose from "mongoose";
import ExpenseModel from "../../model/expenses.model";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { startOfDay } from "date-fns";

export const generateDailyReport: AppRouteMutationImplementation<
  typeof reportContract.generateDailyReport
> = async () => {
  const TIMEZONE = "Asia/Kathmandu";

  const now = new Date();

  const nowInNepal = toZonedTime(now, TIMEZONE);

  const startNepal = startOfDay(nowInNepal);

  const start = fromZonedTime(startNepal, TIMEZONE);
  const end = now;

  console.log("[DAILY REPORT] Nepal Start:", startNepal);
  console.log("[DAILY REPORT] UTC Start:", start);
  console.log("[DAILY REPORT] UTC End:", end);

  try {
    const existing = await dailyReportRepository.getByDate(start);

    if (existing) {
      console.log("[DAILY REPORT] Report already exists.");

      return {
        status: 200,
        body: {
          success: true,
          message: "Report already exists.",
        },
      };
    }

    console.log("[DAILY REPORT] Fetching completed orders...");

    const orders = await OrderModel.find({
      paymentStatus: "paid",
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });

    console.log(`[DAILY REPORT] ${orders.length} completed orders found.`);

    const expenses = await ExpenseModel.find({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });

    console.log(`[DAILY REPORT] ${expenses.length} expenses found.`);

    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.total ?? 0),
      0,
    );

    const totalOrders = orders.length;

    const cashSales = orders
      .filter((o) => o.paymentMethod === "cash")
      .reduce((sum, o) => sum + (o.total ?? 0), 0);

    const onlineSales = orders
      .filter((o) => o.paymentMethod === "online")
      .reduce((sum, o) => sum + (o.total ?? 0), 0);

    const totalDiscount = orders.reduce((sum, o) => sum + (o.discount ?? 0), 0);

    const totalTax = orders.reduce((sum, o) => sum + (o.tax ?? 0), 0);

    const totalExpense = expenses.reduce(
      (sum, expense) => sum + (expense.amount ?? 0),
      0,
    );

    console.log("[DAILY REPORT] Metrics:", {
      totalRevenue,
      totalOrders,
      totalExpense,
      cashSales,
      onlineSales,
      totalDiscount,
      totalTax,
    });

    const report = await dailyReportRepository.create({
      reportDate: start,

      totalRevenue,
      totalOrders,

      totalExpense,

      cashSales,
      onlineSales,

      totalDiscount,
      totalTax,
    });

    console.log("[DAILY REPORT] Report saved successfully.");

    const log = await logRepository.create({
      userId: new mongoose.Types.ObjectId(report._id),
      action: "Daily Reports",
      details: `Daily report generated at ${new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kathmandu",
      })}`,
      module: "Report",
      entityId: report._id.toString(),
      entityType: "DailyReport",
    });

    if (!log) {
      console.log("[DAILY REPORT] Failed to create activity log.");
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Daily report generated successfully.",
      },
    };
  } catch (error) {
    console.error("[DAILY REPORT] ERROR:", error);
    console.error("[DAILY REPORT] DATE RANGE:", {
      start,
      end,
    });

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to generate daily report.",
      },
    };
  }
};

export const reportMutationHandler = {
  generateDailyReport,
};
