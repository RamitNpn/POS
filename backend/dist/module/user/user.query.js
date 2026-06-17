"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userQueryHandler = exports.getUserByID = exports.getAllUsers = void 0;
const user_repository_1 = __importDefault(require("../../repository/user.repository"));
const getAllUsers = async ({ req }) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const role = req.query.role;
        const search = req.query.search;
        const skip = (page - 1) * limit;
        const { data: users, total } = await user_repository_1.default.getAll({
            skip,
            limit,
            role,
            search,
        });
        const totalPages = Math.ceil(total / limit);
        return {
            status: 200,
            body: {
                data: users.map((user) => ({
                    _id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    profile: user.profile,
                    phone: user.phone,
                    status: user.status,
                    createdAt: user.createdAt,
                })),
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                },
            },
        };
    }
    catch (error) {
        console.error("Error in getAllUsers:", error);
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to get users",
            },
        };
    }
};
exports.getAllUsers = getAllUsers;
const getUserByID = async ({ req }) => {
    const { userID } = req.params;
    try {
        const user = await user_repository_1.default.getByID(userID);
        if (!user) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "User not found",
                },
            };
        }
        return {
            status: 200,
            body: {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                profile: user.profile,
                phone: user.phone,
                status: user.status,
                createdAt: user.createdAt,
            },
        };
    }
    catch (error) {
        console.error("Error in getUserByID:", error);
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to get user",
            },
        };
    }
};
exports.getUserByID = getUserByID;
exports.userQueryHandler = {
    getAllUsers: exports.getAllUsers,
    getUserByID: exports.getUserByID,
};
