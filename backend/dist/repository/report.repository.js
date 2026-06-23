"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dailyReportRepository = void 0;
const report_model_1 = __importDefault(require("../model/report.model"));
class DailyReportRepository {
    constructor() {
        this.model = report_model_1.default;
    }
    async create(payload) {
        return report_model_1.default.create(payload);
    }
    async getByDate(reportDate) {
        return report_model_1.default.findOne({
            reportDate,
        });
    }
    async getAll({ limit, skip, from, to, }) {
        const query = {};
        if (from || to) {
            query.reportDate = {};
            if (from) {
                query.reportDate.$gte = new Date(from);
            }
            if (to) {
                query.reportDate.$lte = new Date(to);
            }
        }
        console.log("FINAL QUERY:", JSON.stringify(query, null, 2));
        const data = await this.model
            .find(query)
            .sort({ reportDate: -1 })
            .skip(skip)
            .limit(limit);
        const total = await this.model.countDocuments(query);
        return { data, total };
    }
}
exports.dailyReportRepository = new DailyReportRepository();
