// queries/getDailyReports.ts

import { AppRouteQueryImplementation } from "@ts-rest/express";
import { reportContract } from "../../contract/daily-report/report.contract";
import { dailyReportRepository } from "../../repository/report.repository";

export const getDailyReports: AppRouteQueryImplementation<
  typeof reportContract.getDailyReports
> = async ({ query }) => {
  const { page, limit } = query;

  const result =
    await dailyReportRepository.getAll(page, limit);

  return {
    status: 200,
    body: {
      success: true,

      data: result.data.map((report) => ({
        id: report._id.toString(),

        reportDate: report.reportDate.toISOString(),

        totalRevenue: report.totalRevenue,
        totalOrders: report.totalOrders,

        cashSales: report.cashSales,
        onlineSales: report.onlineSales,

        totalDiscount: report.totalDiscount,
        totalTax: report.totalTax,

        generatedAt: report.generatedAt.toISOString(),
      })),

      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    },
  };
};

export const reportQueryHandler = {
  getDailyReports,
};