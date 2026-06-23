"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMutationHandler = exports.removeRole = exports.updateRole = exports.createRole = void 0;
const role_repository_1 = __importDefault(require("../../repository/role.repository"));
const createRole = async ({ req }) => {
    try {
        const { name, description, isActive } = req.body;
        const existingRole = await role_repository_1.default.getByName(name);
        if (existingRole) {
            return {
                status: 400,
                body: {
                    success: false,
                    error: "Role already exists",
                },
            };
        }
        await role_repository_1.default.create({
            name,
            description,
            isActive,
        });
        return {
            status: 201,
            body: {
                success: true,
                message: "Role created successfully",
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
exports.createRole = createRole;
const updateRole = async ({ req }) => {
    try {
        const { roleID } = req.params;
        const Role = await role_repository_1.default.getByID(roleID);
        if (!Role) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Role not found",
                },
            };
        }
        const { name, description, isActive } = req.body;
        if (name && name !== Role.name) {
            const exists = await role_repository_1.default.getByName(name);
            if (exists) {
                return {
                    status: 400,
                    body: {
                        success: false,
                        error: "Role already exists",
                    },
                };
            }
        }
        await role_repository_1.default.update(roleID, {
            name,
            description,
            isActive,
        });
        return {
            status: 200,
            body: {
                success: true,
                message: "Role updated successfully",
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
exports.updateRole = updateRole;
const removeRole = async ({ req }) => {
    try {
        const { roleID } = req.params;
        const Role = await role_repository_1.default.getByID(roleID);
        if (!Role) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Role not found",
                },
            };
        }
        await role_repository_1.default.delete(roleID);
        return {
            status: 200,
            body: {
                success: true,
                message: "Role deleted successfully",
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
exports.removeRole = removeRole;
exports.roleMutationHandler = {
    createRole: exports.createRole,
    updateRole: exports.updateRole,
    removeRole: exports.removeRole,
};
