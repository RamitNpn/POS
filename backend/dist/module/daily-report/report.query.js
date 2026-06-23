"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportQueryHandler = exports.getDailyReports = void 0;
const report_repository_1 = require("../../repository/report.repository");
const getDailyReports = async ({ req }) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit);
        const skip = (page - 1) * limit;
        const to = req.query.to;
        const from = req.query.from;
        const result = await report_repository_1.dailyReportRepository.getAll({ skip, limit, to, from });
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
    }
    catch {
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to fetch daily reports",
            },
        };
    }
};
exports.getDailyReports = getDailyReports;
exports.reportQueryHandler = {
    getDailyReports: exports.getDailyReports,
};
