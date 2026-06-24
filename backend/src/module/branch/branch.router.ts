import { initServer } from "@ts-rest/express";

import { branchContract } from "../../contract/branch/branch.contract";
import { branchMutationHandler } from "./branch.mutation";
import { branchQueryHandler } from "./branch.query";

import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware";

const s = initServer();

export const branchRouter = s.router(branchContract, {
  createBranch: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: branchMutationHandler.createBranch,
  },

  updateBranch: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: branchMutationHandler.updateBranch,
  },

  deleteBranch: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: branchMutationHandler.deleteBranch as any,
  },

  getAllBranches: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: branchQueryHandler.getAllBranches,
  },

  getBranchByID: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: branchQueryHandler.getBranchById,
  },
});
