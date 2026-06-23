"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportMutationHandler = exports.generateDailyReport = void 0;
const report_repository_1 = require("../../repository/report.repository");
const order_model_1 = __importDefault(require("../../model/order.model"));
const generateDailyReport = async () => {
    const start = new Date();
    start.setDate(start.getDate() - 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    const existing = await report_repository_1.dailyReportRepository.getByDate(start);
    if (existing) {
        return {
            status: 200,
            body: {
                success: true,
                message: "Report already exists.",
            },
        };
    }
    const orders = await order_model_1.default.find({
        status: "completed",
        createdAt: {
            $gte: start,
            $lte: end,
        },
    });
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    await report_repository_1.dailyReportRepository.create({
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
exports.generateDailyReport = generateDailyReport;
exports.reportMutationHandler = {
    generateDailyReport: exports.generateDailyReport,
};
