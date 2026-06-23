import { AppRouteMutationImplementation } from "@ts-rest/express";
import { expenseContract } from "../../contract/expenses/expenses.contract";
import expensesRepository from "../../repository/expenses.repository";
import logRepository from "../../repository/log.repository";
import userRepository from "../../repository/user.repository";

export const createExpense: AppRouteMutationImplementation<
  typeof expenseContract.createExpense
> = async ({ body }) => {
  try {
    const expense = await expensesRepository.create({
      ...body,
      date: new Date(body.date),
    });

    const admins = await userRepository.getByRole("admin");
    const admin = admins?.[0];

    if (admin) {
      await logRepository.create({
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
  } catch (error) {
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

    const updated = await expensesRepository.update(expenseId, req.body);

    if (!updated) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Expense not found",
        },
      };
    }

    const admins = await userRepository.getByRole("admin");
    const admin = admins?.[0];

    if (admin) {
      await logRepository.create({
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
  } catch (error) {
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
    const deleted = await expensesRepository.delete(req.params.expenseId);

    if (!deleted) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Expense not found",
        },
      };
    }

    const admins = await userRepository.getByRole("admin");
    const admin = admins?.[0];

    if (admin) {
      await logRepository.create({
        userId: admin._id,
        action: "Expense deleted",
        details: `${admin.name} deleted an expense from ${deleted.category ||"list"}`,
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
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const espensesMutationHandler = {
  createExpense,
  updateExpense,
  deleteExpense,
};
