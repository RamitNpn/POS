"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.espensesMutationHandler = exports.deleteExpense = exports.updateExpense = exports.createExpense = void 0;
const expenses_repository_1 = __importDefault(require("../../repository/expenses.repository"));
const log_repository_1 = __importDefault(require("../../repository/log.repository"));
const user_repository_1 = __importDefault(require("../../repository/user.repository"));
const createExpense = async ({ body }) => {
    try {
        const expense = await expenses_repository_1.default.create({
            ...body,
            date: new Date(body.date),
        });
        const admins = await user_repository_1.default.getByRole("admin");
        const admin = admins?.[0];
        if (admin) {
            await log_repository_1.default.create({
                userId: admin._id,
                action: "Expense Create",
                details: `${admin.name} added an expense in ${body.category}`,
                module: "Expense",
                entityId: `${expense._id}`,
                entityType: "Expense",
            });
        }
        return {
            status: 201,
            body: {
                success: true,
                message: "Expense created successfully",
            },
        };
    }
    catch (error) {
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.createExpense = createExpense;
const updateExpense = async ({ req }) => {
    try {
        const { expenseId } = req.params;
        const updated = await expenses_repository_1.default.update(expenseId, req.body);
        if (!updated) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Expense not found",
                },
            };
        }
        const admins = await user_repository_1.default.getByRole("admin");
        const admin = admins?.[0];
        if (admin) {
            await log_repository_1.default.create({
                userId: admin._id,
                action: "Expense Update",
                details: `${admin.name} updated an expense in ${req.body.category || "list"}`,
                module: "Expense",
                entityId: `${updated._id}`,
                entityType: "Expense",
            });
        }
        return {
            status: 200,
            body: {
                success: true,
                message: "Expense updated successfully",
            },
        };
    }
    catch (error) {
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.updateExpense = updateExpense;
const deleteExpense = async ({ req }) => {
    try {
        const deleted = await expenses_repository_1.default.delete(req.params.expenseId);
        if (!deleted) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Expense not found",
                },
            };
        }
        const admins = await user_repository_1.default.getByRole("admin");
        const admin = admins?.[0];
        if (admin) {
            await log_repository_1.default.create({
                userId: admin._id,
                action: "Expense deleted",
                details: `${admin.name} deleted an expense from ${deleted.category || "list"}`,
                module: "Expense",
                entityId: `${deleted._id}`,
                entityType: "Expense",
            });
        }
        return {
            status: 200,
            body: {
                success: true,
                message: "Expense deleted successfully",
            },
        };
    }
    catch (error) {
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.deleteExpense = deleteExpense;
exports.espensesMutationHandler = {
    createExpense: exports.createExpense,
    updateExpense: exports.updateExpense,
    deleteExpense: exports.deleteExpense,
};
