"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMutationHandler = exports.removeRole = exports.updateRole = exports.createRole = void 0;
const role_repository_1 = __importDefault(require("../../repository/role.repository"));
const createRole = async ({ req }) => {
    try {
        console.log("[CREATE ROLE] BODY:", req.body);
        const { name, description, isActive } = req.body;
        const existingRole = await role_repository_1.default.getByName(name);
        console.log("[CREATE ROLE] EXISTING ROLE CHECK:", {
            name,
            exists: !!existingRole,
        });
        if (existingRole) {
            console.warn("[CREATE ROLE] ROLE ALREADY EXISTS:", name);
            return {
                status: 400,
                body: {
                    success: false,
                    error: "Role already exists",
                },
            };
        }
        console.log("[CREATE ROLE] CREATING ROLE...");
        const created = await role_repository_1.default.create({
            name,
            description,
            isActive,
        });
        console.log("[CREATE ROLE] CREATED ROLE ID:", created?._id);
        return {
            status: 201,
            body: {
                success: true,
                message: "Role created successfully",
            },
        };
    }
    catch (error) {
        console.error("[CREATE ROLE] ERROR:", error);
        console.error("[CREATE ROLE] BODY:", req.body);
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
        console.log("[UPDATE ROLE] PARAMS:", req.params);
        console.log("[UPDATE ROLE] BODY:", req.body);
        const { roleID } = req.params;
        const Role = await role_repository_1.default.getByID(roleID);
        console.log("[UPDATE ROLE] EXISTING ROLE:", {
            roleID,
            found: !!Role,
        });
        if (!Role) {
            console.warn("[UPDATE ROLE] ROLE NOT FOUND:", roleID);
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
            console.log("[UPDATE ROLE] NAME DUPLICATE CHECK:", {
                name,
                exists: !!exists,
            });
            if (exists) {
                console.warn("[UPDATE ROLE] DUPLICATE ROLE NAME:", name);
                return {
                    status: 400,
                    body: {
                        success: false,
                        error: "Role already exists",
                    },
                };
            }
        }
        console.log("[UPDATE ROLE] UPDATING ROLE...");
        await role_repository_1.default.update(roleID, {
            name,
            description,
            isActive,
        });
        console.log("[UPDATE ROLE] UPDATED SUCCESSFULLY:", roleID);
        return {
            status: 200,
            body: {
                success: true,
                message: "Role updated successfully",
            },
        };
    }
    catch (error) {
        console.error("[UPDATE ROLE] ERROR:", error);
        console.error("[UPDATE ROLE] PARAMS:", req.params);
        console.error("[UPDATE ROLE] BODY:", req.body);
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
        console.log("[DELETE ROLE] PARAMS:", req.params);
        const { roleID } = req.params;
        const Role = await role_repository_1.default.getByID(roleID);
        console.log("[DELETE ROLE] EXISTING ROLE:", {
            roleID,
            found: !!Role,
        });
        if (!Role) {
            console.warn("[DELETE ROLE] ROLE NOT FOUND:", roleID);
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Role not found",
                },
            };
        }
        console.log("[DELETE ROLE] DELETING ROLE...");
        await role_repository_1.default.delete(roleID);
        console.log("[DELETE ROLE] DELETED SUCCESSFULLY:", roleID);
        return {
            status: 200,
            body: {
                success: true,
                message: "Role deleted successfully",
            },
        };
    }
    catch (error) {
        console.error("[DELETE ROLE] ERROR:", error);
        console.error("[DELETE ROLE] PARAMS:", req.params);
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
