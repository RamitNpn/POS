"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expensesQueryHandler = exports.getExpenseByID = exports.getAllExpenses = void 0;
const expenses_repository_1 = __importDefault(require("../../repository/expenses.repository"));
const getAllExpenses = async ({ req }) => {
    try {
        console.log("[GET ALL EXPENSES] QUERY:", req.query);
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        console.log("[GET ALL EXPENSES] PARSED PAGINATION:", {
            page,
            limit,
        });
        const skip = (page - 1) * limit;
        console.log("[GET ALL EXPENSES] SKIP VALUE:", skip);
        console.log("[GET ALL EXPENSES] FILTERS:", {
            search: req.query.search,
            category: req.query.category,
            supplier: req.query.supplier,
        });
        console.log("[GET ALL EXPENSES] FETCHING FROM DB...");
        const { data, total } = await expenses_repository_1.default.getAll({
            skip,
            limit,
            search: req.query.search,
            category: req.query.category,
            supplier: req.query.supplier,
        });
        console.log("[GET ALL EXPENSES] DB RESULT:", {
            returned: data?.length,
            total,
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
        console.log("[GET ALL EXPENSES] FORMATTED COUNT:", formatted.length);
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
    catch (error) {
        console.error("[GET ALL EXPENSES] ERROR:", error);
        console.error("[GET ALL EXPENSES] QUERY:", req.query);
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
        console.log("[GET EXPENSE BY ID] PARAMS:", req.params);
        const expense = await expenses_repository_1.default.getById(req.params.expenseId);
        console.log("[GET EXPENSE BY ID] DB RESULT:", expense);
        if (!expense) {
            console.log("[GET EXPENSE BY ID] NOT FOUND:", req.params.expenseId);
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
        console.error("[GET EXPENSE BY ID] ERROR:", error);
        console.error("[GET EXPENSE BY ID] PARAMS:", req.params);
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
