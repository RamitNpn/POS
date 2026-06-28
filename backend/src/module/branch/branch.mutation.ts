import { AppRouteMutationImplementation } from "@ts-rest/express";
import { branchContract } from "../../contract/branch/branch.contract";
import branchRepository from "../../repository/branch.repository";
import logRepository from "../../repository/log.repository";
import mongoose from "mongoose";

export const createBranch: AppRouteMutationImplementation<
  typeof branchContract.createBranch
> = async ({ req }) => {
  try {
    console.log("[CREATE BRANCH] REQUEST BODY:", req.body);

    const branch = await branchRepository.create(req.body);

    console.log("[CREATE BRANCH] SUCCESS RESPONSE:", branch);

    const log = await logRepository.create({
      userId: new mongoose.Types.ObjectId(req.user?.id),
      action: "Create",
      details: `${branch.name} created at ${new Date().toLocaleString(
        "en-US",
        {
          timeZone: "Asia/Kathmandu",
        },
      )}`,
      module: "Branch",
      entityId: `${branch._id}`,
      entityType: "",
    });

    if (!log) {
      console.log("User log not created", log);
    }

    return {
      status: 201,
      body: {
        success: true,
        message: "Branch created successfully",
        data: branch,
      },
    };
  } catch (error) {
    console.error("[CREATE BRANCH] ERROR:", error);
    console.error("[CREATE BRANCH] REQUEST BODY:", req.body);

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
    console.log("[UPDATE BRANCH] PARAMS:", req.params);
    console.log("[UPDATE BRANCH] BODY:", req.body);

    const branch = await branchRepository.update(req.params.branchID, req.body);

    console.log("[UPDATE BRANCH] DB RESULT:", branch);

    if (!branch) {
      console.log("[UPDATE BRANCH] NOT FOUND:", req.params.branchID);

      return {
        status: 404,
        body: {
          success: false,
          error: "Branch not found",
        },
      };
    }

    const log = await logRepository.create({
      userId: new mongoose.Types.ObjectId(req.user?.id),
      action: "Update",
      details: `${branch.name} updated at ${new Date().toLocaleString(
        "en-US",
        {
          timeZone: "Asia/Kathmandu",
        },
      )}`,
      module: "Branch",
      entityId: `${branch._id}`,
      entityType: "",
    });

    if (!log) {
      console.log("User log not created", log);
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Branch updated successfully",
        data: branch,
      },
    };
  } catch (error) {
    console.error("[UPDATE BRANCH] ERROR:", error);
    console.error("[UPDATE BRANCH] PARAMS:", req.params);
    console.error("[UPDATE BRANCH] BODY:", req.body);

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
    console.log("[DELETE BRANCH] PARAMS:", req.params);

    const branchData = await branchRepository.getByID(req.params.branchID);

    const log = await logRepository.create({
      userId: new mongoose.Types.ObjectId(req.user?.id),
      action: "Delete",
      details: `${branchData?.name} deleted at ${new Date().toLocaleString(
        "en-US",
        {
          timeZone: "Asia/Kathmandu",
        },
      )}`,
      module: "Branch",
      entityId: `${req.params.branchID}`,
      entityType: "",
    });

    if (!log) {
      console.log("User log not created", log);
    }

    const branch = await branchRepository.delete(req.params.branchID);

    console.log("[DELETE BRANCH] DB RESULT:", branch);

    if (!branch) {
      console.log("[DELETE BRANCH] NOT FOUND:", req.params.branchID);

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
        message: "Branch deleted successfully",
      },
    };
  } catch (error) {
    console.error("[DELETE BRANCH] ERROR:", error);
    console.error("[DELETE BRANCH] PARAMS:", req.params);

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
};
