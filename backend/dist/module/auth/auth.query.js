"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authQueryHandler = exports.getMe = void 0;
const user_repository_1 = __importDefault(require("../../repository/user.repository"));
const getMe = async ({ req }) => {
    if (!req.user) {
        return {
            status: 401,
            body: {
                success: false,
                error: "Not authenticated.",
            },
        };
    }
    const user = await user_repository_1.default.getByID(req.user.id);
    if (!user) {
        return {
            status: 401,
            body: {
                success: false,
                error: "Authenticated user not found.",
            },
        };
    }
    return {
        status: 200,
        body: {
            success: true,
            user: {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                profile: user.profile,
                phone: user.phone,
                status: user.status,
                createdAt: user.createdAt,
            },
        },
    };
};
exports.getMe = getMe;
exports.authQueryHandler = {
    getMe: exports.getMe,
};
