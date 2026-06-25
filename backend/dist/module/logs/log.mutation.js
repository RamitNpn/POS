"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityLogMutationHandler = exports.deleteActivityLog = exports.createActivityLog = void 0;
const log_repository_1 = __importDefault(require("../../repository/log.repository"));
const mongoose_1 = __importDefault(require("mongoose"));
const createActivityLog = async ({ req }) => {
    try {
        console.log("[CREATE ACTIVITY LOG] REQUEST BODY:", req.body);
        const { userId, action, details, entityId, entityType, module } = req.body;
        console.log("[CREATE ACTIVITY LOG] PARSED DATA:", {
            userId,
            action,
            module,
            entityType,
            entityId,
        });
        console.log("[CREATE ACTIVITY LOG] CREATING LOG IN DB...");
        await log_repository_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            action,
            details,
            module,
            entityId,
            entityType,
        });
        console.log("[CREATE ACTIVITY LOG] SUCCESS");
        return {
            status: 201,
            body: {
                success: true,
                message: "Activity log created successfully",
            },
        };
    }
    catch (error) {
        console.error("[CREATE ACTIVITY LOG] ERROR:", error);
        console.error("[CREATE ACTIVITY LOG] REQUEST BODY:", req.body);
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.createActivityLog = createActivityLog;
const deleteActivityLog = async ({ req }) => {
    try {
        console.log("[DELETE ACTIVITY LOG] PARAMS:", req.params);
        const { logId } = req.params;
        console.log("[DELETE ACTIVITY LOG] LOG ID:", logId);
        const log = await log_repository_1.default.getByID(logId);
        console.log("[DELETE ACTIVITY LOG] DB RESULT:", log);
        if (!log) {
            console.log("[DELETE ACTIVITY LOG] NOT FOUND:", logId);
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Activity log not found",
                },
            };
        }
        console.log("[DELETE ACTIVITY LOG] DELETING LOG...");
        await log_repository_1.default.delete(logId);
        console.log("[DELETE ACTIVITY LOG] SUCCESS DELETED:", logId);
        return {
            status: 200,
            body: {
                success: true,
                message: "Activity log deleted successfully",
            },
        };
    }
    catch (error) {
        console.error("[DELETE ACTIVITY LOG] ERROR:", error);
        console.error("[DELETE ACTIVITY LOG] PARAMS:", req.params);
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.deleteActivityLog = deleteActivityLog;
exports.activityLogMutationHandler = {
    createActivityLog: exports.createActivityLog,
    deleteActivityLog: exports.deleteActivityLog,
};
