"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMutationHandler = exports.removeUser = exports.updateUser = void 0;
const user_repository_1 = __importDefault(require("../../repository/user.repository"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createUser = async ({ req }) => {
    try {
        const { name, email, role, password, phone, status } = req.body;
        const existingUser = await user_repository_1.default.getByEmail(email.toLowerCase());
        if (existingUser) {
            return {
                status: 400,
                body: {
                    success: false,
                    error: "Email already exists",
                    message: "Email already exist",
                },
            };
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const files = req.files;
        const profileUrl = files?.profile?.[0]?.path || "";
        const created = await user_repository_1.default.create({
            name,
            email: email.toLowerCase(),
            role,
            profile: profileUrl,
            password: hashedPassword,
            phone,
            status,
        });
        return {
            status: 201,
            body: {
                success: true,
                message: "User created successfully",
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
const updateUser = async ({ req }) => {
    try {
        const { userID } = req.params;
        const existingUser = await user_repository_1.default.getByID(userID);
        if (!existingUser) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "User not found",
                },
            };
        }
        const { name, email, role, password, phone, status } = req.body;
        const files = req.files;
        const profileUrl = files?.profile?.[0]?.path;
        const updateData = {};
        if (name)
            updateData.name = name;
        if (email)
            updateData.email = email.toLowerCase();
        if (role)
            updateData.role = role;
        if (phone)
            updateData.phone = phone;
        if (status)
            updateData.status = status;
        if (profileUrl)
            updateData.profile = profileUrl;
        if (password) {
            updateData.password = await bcryptjs_1.default.hash(password, 10);
        }
        const updated = await user_repository_1.default.update(userID, updateData);
        if (!updated) {
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
                success: true,
                message: "User updated successfully",
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
exports.updateUser = updateUser;
const removeUser = async ({ req }) => {
    try {
        const { userID } = req.params;
        const existingUser = await user_repository_1.default.getByID(userID);
        if (!existingUser) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "User not found",
                },
            };
        }
        const deleted = await user_repository_1.default.delete(userID);
        if (!deleted) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "User could not be deleted",
                },
            };
        }
        return {
            status: 200,
            body: {
                success: true,
                message: "User deleted successfully",
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
exports.removeUser = removeUser;
exports.userMutationHandler = {
    createUser,
    updateUser: exports.updateUser,
    removeUser: exports.removeUser,
};
