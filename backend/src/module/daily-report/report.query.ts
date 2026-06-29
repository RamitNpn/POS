import { AppRouteQueryImplementation } from "@ts-rest/express";
import { reportContract } from "../../contract/daily-report/report.contract";
import { dailyReportRepository } from "../../repository/report.repository";

export const getDailyReports: AppRouteQueryImplementation<
  typeof reportContract.getDailyReports
> = async ({ req }) => {
  try {
    console.log("[GET DAILY REPORTS] QUERY:", req.query);

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit);

    console.log("[GET DAILY REPORTS] PARSED PAGINATION:", {
      page,
      limit,
    });

    const skip = (page - 1) * limit;

    const to = req.query.to as string | undefined;
    const from = req.query.from as string | undefined;

    console.log("[GET DAILY REPORTS] FILTERS:", {
      to,
      from,
      skip,
    });

    console.log("[GET DAILY REPORTS] FETCHING FROM DB...");

    const result = await dailyReportRepository.getAll({
      skip,
      limit,
      to,
      from,
    });

    console.log("[GET DAILY REPORTS] DB RESULT:", {
      total: result?.total,
      returned: result?.data?.length,
    });

    const formatted = result.data.map((report) => ({
      id: report._id.toString(),
      reportDate: report.reportDate.toISOString(),
      totalRevenue: report.totalRevenue,
      totalOrders: report.totalOrders,
      totalExpense: report.totalExpense,
      cashSales: report.cashSales,
      onlineSales: report.onlineSales,
      totalDiscount: report.totalDiscount,
      totalTax: report.totalTax,
      generatedAt: report.generatedAt.toISOString(),
    }));

    console.log(
      "[GET DAILY REPORTS] FORMATTED RESULT COUNT:",
      formatted.length,
    );

    return {
      status: 200,
      body: {
        success: true,
        data: formatted,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      },
    };
  } catch (error) {
    console.error("[GET DAILY REPORTS] ERROR:", error);
    console.error("[GET DAILY REPORTS] QUERY:", req.query);

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
