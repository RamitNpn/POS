import { AppRouteQueryImplementation } from "@ts-rest/express";
import { expenseContract } from "../../contract/expenses/expenses.contract";
import expensesRepository from "../../repository/expenses.repository";

export const getAllExpenses: AppRouteQueryImplementation<
  typeof expenseContract.getAllExpenses
> = async ({ req }) => {
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

    const { data, total } = await expensesRepository.getAll({
      skip,
      limit,
      search: req.query.search as string,
      category: req.query.category as string,
      supplier: req.query.supplier as string,
    });

    console.log("[GET ALL EXPENSES] DB RESULT:", {
      returned: data?.length,
      total,
    });

    const formatted = data.map((expense: any) => ({
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
  } catch (error) {
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

export const getExpenseByID: AppRouteQueryImplementation<
  typeof expenseContract.getExpenseById
> = async ({ req }) => {
  try {
    console.log("[GET EXPENSE BY ID] PARAMS:", req.params);

    const expense = await expensesRepository.getById(req.params.expenseId);

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
  } catch (error) {
    console.error("[GET EXPENSE BY ID] ERROR:", error);
    console.error("[GET EXPENSE BY ID] PARAMS:", req.params);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const expensesQueryHandler = {
  getAllExpenses,
  getExpenseByID,
};
