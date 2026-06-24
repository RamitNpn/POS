"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.branchRouter = void 0;
const express_1 = require("@ts-rest/express");
const branch_contract_1 = require("../../contract/branch/branch.contract");
const branch_mutation_1 = require("./branch.mutation");
const branch_query_1 = require("./branch.query");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const s = (0, express_1.initServer)();
exports.branchRouter = s.router(branch_contract_1.branchContract, {
    createBranch: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: branch_mutation_1.branchMutationHandler.createBranch,
    },
    updateBranch: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: branch_mutation_1.branchMutationHandler.updateBranch,
    },
    deleteBranch: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: branch_mutation_1.branchMutationHandler.deleteBranch,
    },
    getAllBranches: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: branch_query_1.branchQueryHandler.getAllBranches,
    },
    getBranchByID: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: branch_query_1.branchQueryHandler.getBranchById,
    },
});
