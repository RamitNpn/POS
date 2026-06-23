"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleQueryHandler = exports.getRoleByID = exports.getAllRoles = void 0;
const role_repository_1 = __importDefault(require("../../repository/role.repository"));
const user_repository_1 = __importDefault(require("../../repository/user.repository"));
const getAllRoles = async ({ req }) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const search = req.query.search;
        const skip = (page - 1) * limit;
        const { data, total } = await role_repository_1.default.getAll({
            skip,
            limit,
            search,
        });
        const formattedData = await Promise.all(data.map(async (role) => {
            const userCount = await user_repository_1.default.countByRole(role._id.toString());
            return {
                _id: role._id.toString(),
                name: role.name,
                description: role.description,
                userCount,
                isActive: role.isActive,
                createdAt: role.createdAt,
                updatedAt: role.updatedAt,
            };
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
                error: "Failed to fetch roles",
            },
        };
    }
};
exports.getAllRoles = getAllRoles;
const getRoleByID = async ({ req }) => {
    try {
        const { roleID } = req.params;
        const role = await role_repository_1.default.getByID(roleID);
        if (!role) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "role not found",
                },
            };
        }
        const userCount = await role_repository_1.default.countByRole(role._id.toString());
        return {
            status: 200,
            body: {
                _id: role._id.toString(),
                name: role.name,
                userCount: userCount,
                description: role.description,
                isActive: role.isActive,
                createdAt: role.createdAt,
                updatedAt: role.updatedAt,
            },
        };
    }
    catch {
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to fetch role",
            },
        };
    }
};
exports.getRoleByID = getRoleByID;
exports.roleQueryHandler = {
    getAllRoles: exports.getAllRoles,
    getRoleByID: exports.getRoleByID,
};
