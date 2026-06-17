"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableRouter = void 0;
const express_1 = require("@ts-rest/express");
const table_contract_1 = require("../../contract/table/table.contract");
const table_mutation_1 = require("./table.mutation");
const table_query_1 = require("./table.query");
const s = (0, express_1.initServer)();
exports.tableRouter = s.router(table_contract_1.tableContract, {
    createTable: table_mutation_1.tableMutationHandler.createTable,
    updateTable: table_mutation_1.tableMutationHandler.updateTable,
    updateTableStatus: table_mutation_1.tableMutationHandler.updateTicketStatus,
    removeTable: table_mutation_1.tableMutationHandler.removeTable,
    getAllTables: table_query_1.tableQueryHandler.getAllTables,
    getTableByID: table_query_1.tableQueryHandler.getTableByID,
});
