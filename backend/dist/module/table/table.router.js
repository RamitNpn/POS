"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableRouter = void 0;
const express_1 = require("@ts-rest/express");
const table_contract_1 = require("../../contract/table/table.contract");
const table_mutation_1 = require("./table.mutation");
const table_query_1 = require("./table.query");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const s = (0, express_1.initServer)();
exports.tableRouter = s.router(table_contract_1.tableContract, {
    createTable: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: table_mutation_1.tableMutationHandler.createTable,
    },
    updateTable: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: table_mutation_1.tableMutationHandler.updateTable,
    },
    updateTableStatus: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("cashier", "admin")],
        handler: table_mutation_1.tableMutationHandler.updateTableStatus,
    },
    removeTable: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: table_mutation_1.tableMutationHandler.removeTable,
    },
    getAllTables: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("cashier", "admin", "waiter")],
        handler: table_query_1.tableQueryHandler.getAllTables,
    },
    getTableByID: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("cashier", "admin", "waiter")],
        handler: table_query_1.tableQueryHandler.getTableByID,
    },
});
