"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.branchRouter = void 0;
const express_1 = require("@ts-rest/express");
const branch_contract_1 = require("../../contract/branch/branch.contract");
const branch_mutation_1 = require("./branch.mutation");
const branch_query_1 = require("./branch.query");
const s = (0, express_1.initServer)();
exports.branchRouter = s.router(branch_contract_1.branchContract, {
    createBranch: branch_mutation_1.branchMutationHandler.createBranch,
    updateBranch: branch_mutation_1.branchMutationHandler.updateBranch,
    deleteBranch: branch_mutation_1.branchMutationHandler.deleteBranch,
    getAllBranches: branch_query_1.branchQueryHandler.getAllBranches,
    getBranchByID: branch_query_1.branchQueryHandler.getBranchById,
});
