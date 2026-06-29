"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportMutationHandler = exports.generateDailyReport = void 0;
const report_repository_1 = require("../../repository/report.repository");
const order_model_1 = __importDefault(require("../../model/order.model"));
const log_repository_1 = __importDefault(require("../../repository/log.repository"));
const mongoose_1 = __importDefault(require("mongoose"));
const expenses_model_1 = __importDefault(require("../../model/expenses.model"));
const date_fns_tz_1 = require("date-fns-tz");
const date_fns_1 = require("date-fns");
const generateDailyReport = async () => {
    const TIMEZONE = "Asia/Kathmandu";
    const now = new Date();
    const nowInNepal = (0, date_fns_tz_1.toZonedTime)(now, TIMEZONE);
    const startNepal = (0, date_fns_1.startOfDay)(nowInNepal);
    const start = (0, date_fns_tz_1.fromZonedTime)(startNepal, TIMEZONE);
    const end = now;
    console.log("[DAILY REPORT] Nepal Start:", startNepal);
    console.log("[DAILY REPORT] UTC Start:", start);
    console.log("[DAILY REPORT] UTC End:", end);
    try {
        const existing = await report_repository_1.dailyReportRepository.getByDate(start);
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
        const orders = await order_model_1.default.find({
            paymentStatus: "paid",
            createdAt: {
                $gte: start,
                $lte: end,
            },
        });
        console.log(`[DAILY REPORT] ${orders.length} completed orders found.`);
        const expenses = await expenses_model_1.default.find({
            createdAt: {
                $gte: start,
                $lte: end,
            },
        });
        console.log(`[DAILY REPORT] ${expenses.length} expenses found.`);
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total ?? 0), 0);
        const totalOrders = orders.length;
        const cashSales = orders
            .filter((o) => o.paymentMethod === "cash")
            .reduce((sum, o) => sum + (o.total ?? 0), 0);
        const onlineSales = orders
            .filter((o) => o.paymentMethod === "online")
            .reduce((sum, o) => sum + (o.total ?? 0), 0);
        const totalDiscount = orders.reduce((sum, o) => sum + (o.discount ?? 0), 0);
        const totalTax = orders.reduce((sum, o) => sum + (o.tax ?? 0), 0);
        const totalExpense = expenses.reduce((sum, expense) => sum + (expense.amount ?? 0), 0);
        console.log("[DAILY REPORT] Metrics:", {
            totalRevenue,
            totalOrders,
            totalExpense,
            cashSales,
            onlineSales,
            totalDiscount,
            totalTax,
        });
        const report = await report_repository_1.dailyReportRepository.create({
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
        const log = await log_repository_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(report._id),
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
    }
    catch (error) {
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
exports.generateDailyReport = generateDailyReport;
exports.reportMutationHandler = {
    generateDailyReport: exports.generateDailyReport,
};
