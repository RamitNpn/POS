"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseRouter = void 0;
const express_1 = require("@ts-rest/express");
const expenses_contract_1 = require("../../contract/expenses/expenses.contract");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const espenses_mutation_1 = require("./espenses.mutation");
const expenses_query_1 = require("./expenses.query");
const s = (0, express_1.initServer)();
exports.expenseRouter = s.router(expenses_contract_1.expenseContract, {
    createExpense: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: espenses_mutation_1.expensesMutationHandler.createExpense,
    },
    updateExpense: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: espenses_mutation_1.expensesMutationHandler.updateExpense,
    },
    deleteExpense: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: espenses_mutation_1.expensesMutationHandler.deleteExpense,
    },
    getAllExpenses: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: expenses_query_1.expensesQueryHandler.getAllExpenses,
    },
    getExpenseById: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: expenses_query_1.expensesQueryHandler.getExpenseByID,
    },
});
