import { AppRouteMutationImplementation } from "@ts-rest/express";
import { expenseContract } from "../../contract/expenses/expenses.contract";
import expensesRepository from "../../repository/expenses.repository";
import logRepository from "../../repository/log.repository";
import userRepository from "../../repository/user.repository";

export const createExpense: AppRouteMutationImplementation<
  typeof expenseContract.createExpense
> = async ({ body }) => {
  try {
    console.log("[CREATE EXPENSE] REQUEST BODY:", body);

    const expense = await expensesRepository.create({
      ...body,
      date: new Date(body.date),
    });

    console.log("[CREATE EXPENSE] DB RESULT:", expense);

    const admins = await userRepository.getByRole("admin");
    console.log("[CREATE EXPENSE] ADMINS FOUND:", admins?.length);

    const admin = admins?.[0];

    if (admin) {
      console.log("[CREATE EXPENSE] LOGGING FOR ADMIN:", admin._id);

      await logRepository.create({
        userId: admin._id,
        action: "Expense Create",
        details: `${admin.name} added an expense in ${body.category}`,
        module: "Expense",
        entityId: `${expense._id}`,
        entityType: "Expense",
      });

      console.log("[CREATE EXPENSE] LOG CREATED");
    } else {
      console.log("[CREATE EXPENSE] NO ADMIN FOUND");
    }

    return {
      status: 201,
      body: {
        success: true,
        message: "Expense created successfully",
      },
    };
  } catch (error) {
    console.error("[CREATE EXPENSE] ERROR:", error);
    console.error("[CREATE EXPENSE] REQUEST BODY:", body);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const updateExpense: AppRouteMutationImplementation<
  typeof expenseContract.updateExpense
> = async ({ req }) => {
  try {
    const { expenseId } = req.params;

    console.log("[UPDATE EXPENSE] PARAMS:", req.params);
    console.log("[UPDATE EXPENSE] BODY:", req.body);

    const updated = await expensesRepository.update(expenseId, req.body);

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

    const admins = await userRepository.getByRole("admin");
    console.log("[UPDATE EXPENSE] ADMINS FOUND:", admins?.length);

    const admin = admins?.[0];

    if (admin) {
      console.log("[UPDATE EXPENSE] LOGGING UPDATE BY ADMIN:", admin._id);

      await logRepository.create({
        userId: admin._id,
        action: "Expense Update",
        details: `${admin.name} updated an expense in ${
          req.body.category || "list"
        }`,
        module: "Expense",
        entityId: `${updated._id}`,
        entityType: "Expense",
      });

      console.log("[UPDATE EXPENSE] LOG CREATED");
    } else {
      console.log("[UPDATE EXPENSE] NO ADMIN FOUND");
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Expense updated successfully",
      },
    };
  } catch (error) {
    console.error("[UPDATE EXPENSE] ERROR:", error);
    console.error("[UPDATE EXPENSE] PARAMS:", req.params);
    console.error("[UPDATE EXPENSE] BODY:", req.body);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const deleteExpense: AppRouteMutationImplementation<
  typeof expenseContract.deleteExpense
> = async ({ req }) => {
  try {
    console.log("[DELETE EXPENSE] PARAMS:", req.params);

    const deleted = await expensesRepository.delete(req.params.expenseId);

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

    const admins = await userRepository.getByRole("admin");
    console.log("[DELETE EXPENSE] ADMINS FOUND:", admins?.length);

    const admin = admins?.[0];

    if (admin) {
      console.log("[DELETE EXPENSE] LOGGING DELETE BY ADMIN:", admin._id);

      await logRepository.create({
        userId: admin._id,
        action: "Expense deleted",
        details: `${admin.name} deleted an expense from ${
          deleted.category || "list"
        }`,
        module: "Expense",
        entityId: `${deleted._id}`,
        entityType: "Expense",
      });

      console.log("[DELETE EXPENSE] LOG CREATED");
    } else {
      console.log("[DELETE EXPENSE] NO ADMIN FOUND");
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Expense deleted successfully",
      },
    };
  } catch (error) {
    console.error("[DELETE EXPENSE] ERROR:", error);
    console.error("[DELETE EXPENSE] PARAMS:", req.params);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const expensesMutationHandler = {
  createExpense,
  updateExpense,
  deleteExpense,
};