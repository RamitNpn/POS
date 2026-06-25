"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.branchMutationHandler = exports.deleteBranch = exports.updateBranch = exports.createBranch = void 0;
const branch_repository_1 = __importDefault(require("../../repository/branch.repository"));
const createBranch = async ({ req }) => {
    try {
        console.log("[CREATE BRANCH] REQUEST BODY:", req.body);
        const branch = await branch_repository_1.default.create(req.body);
        console.log("[CREATE BRANCH] SUCCESS RESPONSE:", branch);
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
        console.error("[CREATE BRANCH] ERROR:", error);
        console.error("[CREATE BRANCH] REQUEST BODY:", req.body);
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
        console.log("[UPDATE BRANCH] PARAMS:", req.params);
        console.log("[UPDATE BRANCH] BODY:", req.body);
        const branch = await branch_repository_1.default.update(req.params.branchID, req.body);
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
        console.error("[UPDATE BRANCH] ERROR:", error);
        console.error("[UPDATE BRANCH] PARAMS:", req.params);
        console.error("[UPDATE BRANCH] BODY:", req.body);
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
        console.log("[DELETE BRANCH] PARAMS:", req.params);
        const branch = await branch_repository_1.default.delete(req.params.branchID);
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
    }
    catch (error) {
        console.error("[DELETE BRANCH] ERROR:", error);
        console.error("[DELETE BRANCH] PARAMS:", req.params);
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
