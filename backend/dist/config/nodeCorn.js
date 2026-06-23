"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const report_mutation_1 = require("../module/daily-report/report.mutation");
node_cron_1.default.schedule("5 0 * * *", async () => {
    try {
        await (0, report_mutation_1.generateDailyReport)({
            body: undefined,
            params: undefined,
            query: undefined,
        });
        console.log("Daily report generated.");
    }
    catch (error) {
        console.error(error);
    }
}, {
    timezone: "Asia/Kathmandu",
});
