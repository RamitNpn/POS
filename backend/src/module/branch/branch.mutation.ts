import { AppRouteMutationImplementation } from "@ts-rest/express";
import { branchContract } from "../../contract/branch/branch.contract";
import branchRepository from "../../repository/branch.repository";

export const createBranch: AppRouteMutationImplementation<
  typeof branchContract.createBranch
> = async ({ req }) => {
  try {
    const branch =
      await branchRepository.create(
        req.body,
      );

    return {
      status: 201,
      body: {
        success: true,
        message:
          "Branch created successfully",
        data: branch,
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

export const updateBranch: AppRouteMutationImplementation<
  typeof branchContract.updateBranch
> = async ({ req }) => {
  try {
    const branch =
      await branchRepository.update(
        req.params.branchID,
        req.body,
      );

    if (!branch) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Branch not found",
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message:
          "Branch updated successfully",
        data: branch,
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

export const deleteBranch: AppRouteMutationImplementation<
  typeof branchContract.deleteBranch
> = async ({ req }) => {
  try {
    const branch =
      await branchRepository.delete(
        req.params.branchID,
      );

    if (!branch) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Branch not found",
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message:
          "Branch deleted successfully",
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

export const branchMutationHandler = {
    createBranch,
    updateBranch,
    deleteBranch,
}