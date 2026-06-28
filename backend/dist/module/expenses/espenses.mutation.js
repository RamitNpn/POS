"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expensesMutationHandler = exports.deleteExpense = exports.updateExpense = exports.createExpense = void 0;
const expenses_repository_1 = __importDefault(require("../../repository/expenses.repository"));
const log_repository_1 = __importDefault(require("../../repository/log.repository"));
const mongoose_1 = __importDefault(require("mongoose"));
const createExpense = async ({ body, req }) => {
    try {
        console.log("[CREATE EXPENSE] REQUEST BODY:", body);
        const expense = await expenses_repository_1.default.create({
            ...body,
            date: new Date(body.date),
        });
        console.log("[CREATE EXPENSE] DB RESULT:", expense);
        const log = await log_repository_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(req.user?.id),
            action: "Create",
            details: `${expense?.description} deleted at ${new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kathmandu",
            })}`,
            module: "Expense",
            entityId: `${expense._id}`,
            entityType: "Expense",
        });
        if (!log) {
            console.log("User log not created", log);
        }
        console.log("[CREATE EXPENSE] LOG CREATED");
        return {
            status: 201,
            body: {
                success: true,
                message: "Expense created successfully",
            },
        };
    }
    catch (error) {
        console.error("[CREATE EXPENSE] ERROR:", error);
        console.error("[CREATE EXPENSE] REQUEST BODY:", body);
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
        console.log("[UPDATE EXPENSE] PARAMS:", req.params);
        console.log("[UPDATE EXPENSE] BODY:", req.body);
        const updated = await expenses_repository_1.default.update(expenseId, req.body);
        console.log("[UPDATE EXPENSE] DB RESULT:", updated);
        if (!updated) {
            console.log("[UPDATE EXPENSE] NOT FOUND:", expenseId);
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Expense not found",
                },
            };
        }
        const log = await log_repository_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(req.user?.id),
            action: "Update",
            details: `${updated?.description} updated at ${new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kathmandu",
            })}`,
            module: "Expense",
            entityId: `${updated._id}`,
            entityType: "Expense",
        });
        if (!log) {
            console.log("User log not created", log);
        }
        console.log("[UPDATE EXPENSE] LOG CREATED");
        return {
            status: 200,
            body: {
                success: true,
                message: "Expense updated successfully",
            },
        };
    }
    catch (error) {
        console.error("[UPDATE EXPENSE] ERROR:", error);
        console.error("[UPDATE EXPENSE] PARAMS:", req.params);
        console.error("[UPDATE EXPENSE] BODY:", req.body);
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
        console.log("[DELETE EXPENSE] PARAMS:", req.params);
        const existing = await expenses_repository_1.default.getById(req.params.expenseId);
        console.log("[DELETE EXPENSE] EXISTING CHECK:", existing);
        if (!existing) {
            console.log("[DELETE EXPENSE] EXPENSE NOT FOUND:", req.params.expenseId);
            return {
                status: 400,
                body: {
                    success: false,
                    error: "Expense do not exists",
                },
            };
        }
        const log = await log_repository_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(req.user?.id),
            action: "Delete",
            details: `${existing?.description} deleted at ${new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kathmandu",
            })}`,
            module: "Expense",
            entityId: `${existing._id}`,
            entityType: "Expense",
        });
        if (!log) {
            console.log("User log not created", log);
        }
        console.log("[DELETE EXPENSE] LOG CREATED");
        const deleted = await expenses_repository_1.default.delete(req.params.expenseId);
        console.log("[DELETE EXPENSE] DB RESULT:", deleted);
        if (!deleted) {
            console.log("[DELETE EXPENSE] NOT FOUND:", req.params.expenseId);
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Expense not found",
                },
            };
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
        console.error("[DELETE EXPENSE] ERROR:", error);
        console.error("[DELETE EXPENSE] PARAMS:", req.params);
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
exports.expensesMutationHandler = {
    createExpense: exports.createExpense,
    updateExpense: exports.updateExpense,
    deleteExpense: exports.deleteExpense,
};
