import { initServer } from "@ts-rest/express";
import { branchContract } from "../../contract/branch/branch.contract";
import { branchMutationHandler } from "./branch.mutation";
import { branchQueryHandler } from "./branch.query";

const s = initServer();

export const branchRouter = s.router(branchContract, {
  createBranch: branchMutationHandler.createBranch,
  updateBranch: branchMutationHandler.updateBranch,
  deleteBranch: branchMutationHandler.deleteBranch,

  getAllBranches: branchQueryHandler.getAllBranches,
  getBranchByID: branchQueryHandler.getBranchById,
});
