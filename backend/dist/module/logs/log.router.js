"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityLogRouter = void 0;
const express_1 = require("@ts-rest/express");
const log_contract_1 = require("../../contract/logs/log.contract");
const log_mutation_1 = require("./log.mutation");
const log_query_1 = require("./log.query");
const s = (0, express_1.initServer)();
exports.activityLogRouter = s.router(log_contract_1.activityLogContract, {
    createActivityLog: log_mutation_1.activityLogMutationHandler.createActivityLog,
    deleteActivityLog: log_mutation_1.activityLogMutationHandler.deleteActivityLog,
    getAllActivityLogs: log_query_1.activityLogQueryHandler.getAllActivityLogs,
    getActivityLogByID: log_query_1.activityLogQueryHandler.getActivityLogByID,
});
