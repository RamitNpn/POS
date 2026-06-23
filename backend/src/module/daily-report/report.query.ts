import { AppRouteQueryImplementation } from "@ts-rest/express";
import { reportContract } from "../../contract/daily-report/report.contract";
import { dailyReportRepository } from "../../repository/report.repository";

export const getDailyReports: AppRouteQueryImplementation<
  typeof reportContract.getDailyReports
> = async ({ req }) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit);
    const skip = (page - 1) * limit;

    const to = req.query.to as string | undefined;
    const from = req.query.from as string | undefined;

    const result = await dailyReportRepository.getAll({skip, limit, to, from});

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
  } catch {
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch daily reports",
      },
    };
  }
};

export const reportQueryHandler = {
  getDailyReports,
};
