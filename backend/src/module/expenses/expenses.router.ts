import { initServer } from "@ts-rest/express";
import { expenseContract } from "../../contract/expenses/expenses.contract";
import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware";
import { expensesMutationHandler } from "./espenses.mutation";
import { expensesQueryHandler } from "./expenses.query";

const s = initServer();

export const expenseRouter = s.router(expenseContract, {
  createExpense: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: expensesMutationHandler.createExpense,
  },

  updateExpense: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: expensesMutationHandler.updateExpense,
  },

  deleteExpense: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: expensesMutationHandler.deleteExpense as any,
  },

  getAllExpenses: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: expensesQueryHandler.getAllExpenses,
  },

  getExpenseById: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: expensesQueryHandler.getExpenseByID,
  },
});
