"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.branchMutationHandler = exports.deleteBranch = exports.updateBranch = exports.createBranch = void 0;
const branch_repository_1 = __importDefault(require("../../repository/branch.repository"));
const createBranch = async ({ req }) => {
    try {
        const branch = await branch_repository_1.default.create(req.body);
        return {
            status: 201,
            body: {
                success: true,
                message: "Branch created successfully",
                data: branch,
            },
        };
    }
    catch (error) {
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.createBranch = createBranch;
const updateBranch = async ({ req }) => {
    try {
        const branch = await branch_repository_1.default.update(req.params.branchID, req.body);
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
                message: "Branch updated successfully",
                data: branch,
            },
        };
    }
    catch (error) {
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.updateBranch = updateBranch;
const deleteBranch = async ({ req }) => {
    try {
        const branch = await branch_repository_1.default.delete(req.params.branchID);
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
                message: "Branch deleted successfully",
            },
        };
    }
    catch (error) {
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.deleteBranch = deleteBranch;
exports.branchMutationHandler = {
    createBranch: exports.createBranch,
    updateBranch: exports.updateBranch,
    deleteBranch: exports.deleteBranch,
};
