"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMutationHandler = exports.removeUser = exports.updateUser = void 0;
const user_repository_1 = __importDefault(require("../../repository/user.repository"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const log_repository_1 = __importDefault(require("../../repository/log.repository"));
const mongoose_1 = __importDefault(require("mongoose"));
const createUser = async ({ req }) => {
    try {
        const { name, email, role, phone, status } = req.body;
        console.log("[createUser] request:", {
            name,
            email,
            role,
            phone,
            status,
        });
        const existingUser = await user_repository_1.default.getByEmail(email.toLowerCase());
        console.log("[createUser] existing user:", existingUser);
        if (existingUser) {
            console.log("[createUser] email already exists:", email);
            return {
                status: 400,
                body: {
                    success: false,
                    error: "Email already exists",
                    message: "Email already exist",
                },
            };
        }
        console.log("[createUser] hashing password");
        const hashedPassword = await bcryptjs_1.default.hash(req.body.password, 10);
        const files = req.files;
        console.log("[createUser] uploaded files:", files);
        const profileUrl = files?.profile?.[0]?.path || "";
        console.log("[createUser] profile url:", profileUrl);
        const created = await user_repository_1.default.create({
            name,
            email: email.toLowerCase(),
            role,
            profile: profileUrl,
            password: hashedPassword,
            phone,
            status,
        });
        console.log("[createUser] created user:", {
            id: created?._id,
            email: created?.email,
            role: created?.role,
        });
        const log = await log_repository_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(created._id),
            action: "Create",
            details: `${name} created at ${new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kathmandu",
            })}`,
            module: "User",
            entityId: `${created._id}`,
            entityType: "",
        });
        if (!log) {
            console.log("User log not created", log);
        }
        return {
            status: 201,
            body: {
                success: true,
                message: "User created successfully",
            },
        };
    }
    catch (error) {
        console.error("[createUser] error:", error);
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
        console.log("[updateUser] userID:", userID);
        const existingUser = await user_repository_1.default.getByID(userID);
        console.log("[updateUser] existing user:", existingUser);
        if (!existingUser) {
            console.log("[updateUser] user not found");
            return {
                status: 404,
                body: {
                    success: false,
                    error: "User not found",
                },
            };
        }
        const { name, email, role, password, phone, status } = req.body;
        console.log("[updateUser] payload:", {
            name,
            email,
            role,
            phone,
            status,
            passwordProvided: !!password,
        });
        const files = req.files;
        console.log("[updateUser] uploaded files:", files);
        const profileUrl = files?.profile?.[0]?.path;
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (email !== undefined)
            updateData.email = email.toLowerCase();
        if (role !== undefined)
            updateData.role = role;
        if (phone !== undefined)
            updateData.phone = phone;
        if (status !== undefined)
            updateData.status = status;
        if (profileUrl !== undefined)
            updateData.profile = profileUrl;
        if (password) {
            console.log("[updateUser] hashing new password");
            updateData.password = await bcryptjs_1.default.hash(password, 10);
        }
        console.log("[updateUser] final updateData:", {
            ...updateData,
            password: updateData.password ? "[HASHED]" : undefined,
        });
        const updated = await user_repository_1.default.update(userID, updateData);
        console.log("[updateUser] updated user:", updated);
        if (!updated) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "User not found",
                },
            };
        }
        const log = await log_repository_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(userID),
            action: "Update",
            details: `${name} updated at ${new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kathmandu",
            })}`,
            module: "User",
            entityId: `${userID}`,
            entityType: "",
        });
        if (!log) {
            console.log("User log not created", log);
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
        console.error("[updateUser] error:", error);
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
        console.log("[removeUser] userID:", userID);
        const existingUser = await user_repository_1.default.getByID(userID);
        console.log("[removeUser] existing user:", existingUser);
        if (!existingUser) {
            console.log("[removeUser] user not found");
            return {
                status: 404,
                body: {
                    success: false,
                    error: "User not found",
                },
            };
        }
        const log = await log_repository_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(userID),
            action: "Delete",
            details: `${existingUser.name} deleted at ${new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kathmandu",
            })}`,
            module: "User",
            entityId: `${userID}`,
            entityType: "",
        });
        if (!log) {
            console.log("User log not created", log);
        }
        const deleted = await user_repository_1.default.delete(userID);
        console.log("[removeUser] delete result:", deleted);
        if (!deleted) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "User could not be deleted",
                },
            };
        }
        console.log("[removeUser] user deleted successfully");
        return {
            status: 200,
            body: {
                success: true,
                message: "User deleted successfully",
            },
        };
    }
    catch (error) {
        console.error("[removeUser] error:", error);
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
