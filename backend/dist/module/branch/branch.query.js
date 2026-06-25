"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.branchQueryHandler = exports.getBranchById = exports.getAllBranches = void 0;
const branch_repository_1 = __importDefault(require("../../repository/branch.repository"));
const getAllBranches = async ({ req }) => {
    try {
        console.log("[GET ALL BRANCHES] QUERY:", req.query);
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const search = req.query.search;
        const status = req.query.status;
        console.log("[GET ALL BRANCHES] PARSED PARAMS:", {
            page,
            limit,
            search,
            status,
        });
        const skip = (page - 1) * limit;
        console.log("[GET ALL BRANCHES] SKIP VALUE:", skip);
        const { data, total } = await branch_repository_1.default.getAll({
            skip,
            limit,
            search,
            status,
        });
        console.log("[GET ALL BRANCHES] DB RESULT COUNT:", {
            returned: data?.length,
            total,
        });
        const formattedData = data.map((branch) => ({
            _id: branch._id.toString(),
            name: branch.name,
            address: branch.address,
            phone: branch.phone,
            managerName: branch.managerName,
            status: branch.status,
            opened: branch.opened,
            createdAt: branch.createdAt,
            updatedAt: branch.updatedAt,
        }));
        console.log("[GET ALL BRANCHES] FORMATTED RESPONSE COUNT:", formattedData.length);
        return {
            status: 200,
            body: {
                data: formattedData,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        };
    }
    catch (error) {
        console.error("[GET ALL BRANCHES] ERROR:", error);
        console.error("[GET ALL BRANCHES] QUERY:", req.query);
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to fetch branches",
            },
        };
    }
};
exports.getAllBranches = getAllBranches;
const getBranchById = async ({ req }) => {
    try {
        console.log("[GET BRANCH BY ID] PARAMS:", req.params);
        const { branchID } = req.params;
        const branch = await branch_repository_1.default.getByID(branchID);
        console.log("[GET BRANCH BY ID] DB RESULT:", branch);
        if (!branch) {
            console.log("[GET BRANCH BY ID] NOT FOUND:", branchID);
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
                _id: branch._id.toString(),
                name: branch.name,
                address: branch.address,
                phone: branch.phone,
                managerName: branch.managerName,
                status: branch.status,
                opened: branch.opened,
                createdAt: branch.createdAt,
                updatedAt: branch.updatedAt,
            },
        };
    }
    catch (error) {
        console.error("[GET BRANCH BY ID] ERROR:", error);
        console.error("[GET BRANCH BY ID] PARAMS:", req.params);
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to fetch branch",
            },
        };
    }
};
exports.getBranchById = getBranchById;
exports.branchQueryHandler = {
    getAllBranches: exports.getAllBranches,
    getBranchById: exports.getBranchById,
};
