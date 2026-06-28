"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityLogRouter = void 0;
const express_1 = require("@ts-rest/express");
const log_contract_1 = require("../../contract/logs/log.contract");
const log_mutation_1 = require("./log.mutation");
const log_query_1 = require("./log.query");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const s = (0, express_1.initServer)();
exports.activityLogRouter = s.router(log_contract_1.activityLogContract, {
    createActivityLog: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: log_mutation_1.activityLogMutationHandler.createActivityLog,
    },
    deleteActivityLog: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: log_mutation_1.activityLogMutationHandler.deleteActivityLog,
    },
    getAllActivityLogs: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("waiter", "cashier", "admin")],
        handler: log_query_1.activityLogQueryHandler.getAllActivityLogs,
    },
    getActivityLogByID: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: log_query_1.activityLogQueryHandler.getActivityLogByID,
    },
});
