"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.branchQueryHandler = exports.getBranchById = exports.getAllBranches = void 0;
const branch_repository_1 = __importDefault(require("../../repository/branch.repository"));
const getAllBranches = async ({ req }) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const search = req.query.search;
        const status = req.query.status;
        const skip = (page - 1) * limit;
        const { data, total } = await branch_repository_1.default.getAll({
            skip,
            limit,
            search,
            status,
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
    catch {
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
        const { branchID } = req.params;
        const branch = await branch_repository_1.default.getByID(branchID);
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
    catch {
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
