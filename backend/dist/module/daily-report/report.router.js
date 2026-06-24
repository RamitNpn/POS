"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportRouter = void 0;
const express_1 = require("@ts-rest/express");
const report_contract_1 = require("../../contract/daily-report/report.contract");
const report_mutation_1 = require("./report.mutation");
const report_query_1 = require("./report.query");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const s = (0, express_1.initServer)();
exports.reportRouter = s.router(report_contract_1.reportContract, {
    generateDailyReport: {
        middleware: [
            auth_middleware_1.verifyToken,
            (0, auth_middleware_1.authorizeRoles)("admin"),
        ],
        handler: report_mutation_1.reportMutationHandler.generateDailyReport,
    },
    getDailyReports: {
        middleware: [
            auth_middleware_1.verifyToken,
            (0, auth_middleware_1.authorizeRoles)("admin"),
        ],
        handler: report_query_1.reportQueryHandler.getDailyReports,
    },
});
