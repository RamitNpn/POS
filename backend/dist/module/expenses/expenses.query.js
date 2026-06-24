"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expensesQueryHandler = exports.getExpenseByID = exports.getAllExpenses = void 0;
const expenses_repository_1 = __importDefault(require("../../repository/expenses.repository"));
const getAllExpenses = async ({ req }) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const { data, total } = await expenses_repository_1.default.getAll({
            skip: (page - 1) * limit,
            limit,
            search: req.query.search,
            category: req.query.category,
            supplier: req.query.supplier,
        });
        const formatted = data.map((expense) => ({
            _id: expense._id.toString(),
            category: expense.category,
            description: expense.description,
            amount: expense.amount,
            date: expense.date,
            vendorName: expense.vendorName,
            createdAt: expense.createdAt,
            updatedAt: expense.updatedAt,
        }));
        return {
            status: 200,
            body: {
                data: formatted,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        };
    }
    catch {
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to fetch expenses",
            },
        };
    }
};
exports.getAllExpenses = getAllExpenses;
const getExpenseByID = async ({ req }) => {
    try {
        const expense = await expenses_repository_1.default.getById(req.params.expenseId);
        if (!expense) {
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
                _id: expense._id.toString(),
                category: expense.category,
                description: expense.description,
                amount: expense.amount,
                date: expense.date,
                vendorName: expense.vendorName,
                createdAt: expense.createdAt,
                updatedAt: expense.updatedAt,
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
exports.getExpenseByID = getExpenseByID;
exports.expensesQueryHandler = {
    getAllExpenses: exports.getAllExpenses,
    getExpenseByID: exports.getExpenseByID,
};
