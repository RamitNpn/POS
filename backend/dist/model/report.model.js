"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DailyReportSchema = new mongoose_1.default.Schema({
    reportDate: {
        type: Date,
        required: true,
        unique: true,
        index: true,
    },
    totalRevenue: {
        type: Number,
        required: true,
        default: 0,
    },
    totalOrders: {
        type: Number,
        required: true,
        default: 0,
    },
    totalExpense: {
        type: Number,
        required: true,
        default: 0,
    },
    cashSales: {
        type: Number,
        default: 0,
    },
    onlineSales: {
        type: Number,
        default: 0,
    },
    totalDiscount: {
        type: Number,
        default: 0,
    },
    totalTax: {
        type: Number,
        default: 0,
    },
    generatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
const DailyReportModel = mongoose_1.default.model("DailyReport", DailyReportSchema);
exports.default = DailyReportModel;
