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
        console.log("[GET ALL ROLES] QUERY:", req.query);
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const search = req.query.search;
        const skip = (page - 1) * limit;
        console.log("[GET ALL ROLES] PAGINATION:", { page, limit, skip });
        console.log("[GET ALL ROLES] FETCHING FROM DB...");
        const { data, total } = await role_repository_1.default.getAll({
            skip,
            limit,
            search,
        });
        console.log("[GET ALL ROLES] DB RESULT:", {
            count: data?.length,
            total,
        });
        console.log("[GET ALL ROLES] ENRICHING USER COUNTS...");
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
        console.log("[GET ALL ROLES] FINAL RESULT COUNT:", formattedData.length);
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
        console.error("[GET ALL ROLES] ERROR:", error);
        console.error("[GET ALL ROLES] QUERY:", req.query);
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
        console.log("[GET ROLE BY ID] PARAMS:", req.params);
        const { roleID } = req.params;
        const role = await role_repository_1.default.getByID(roleID);
        console.log("[GET ROLE BY ID] ROLE FOUND:", !!role);
        if (!role) {
            console.warn("[GET ROLE BY ID] NOT FOUND:", roleID);
            return {
                status: 404,
                body: {
                    success: false,
                    error: "role not found",
                },
            };
        }
        console.log("[GET ROLE BY ID] COUNTING USERS...");
        const userCount = await role_repository_1.default.countByRole(role._id.toString());
        console.log("[GET ROLE BY ID] USER COUNT:", userCount);
        return {
            status: 200,
            body: {
                _id: role._id.toString(),
                name: role.name,
                userCount,
                description: role.description,
                isActive: role.isActive,
                createdAt: role.createdAt,
                updatedAt: role.updatedAt,
            },
        };
    }
    catch (error) {
        console.error("[GET ROLE BY ID] ERROR:", error);
        console.error("[GET ROLE BY ID] PARAMS:", req.params);
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
