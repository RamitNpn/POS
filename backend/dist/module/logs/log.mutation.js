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
        const { userId, action, details, entityId, entityType, module } = req.body;
        await log_repository_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            action,
            details,
            module,
            entityId,
            entityType,
        });
        return {
            status: 201,
            body: {
                success: true,
                message: "Activity log created successfully",
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
exports.createActivityLog = createActivityLog;
const deleteActivityLog = async ({ req }) => {
    try {
        const { logId } = req.params;
        const log = await log_repository_1.default.getByID(logId);
        if (!log) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Activity log not found",
                },
            };
        }
        await log_repository_1.default.delete(logId);
        return {
            status: 200,
            body: {
                success: true,
                message: "Activity log deleted successfully",
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
exports.deleteActivityLog = deleteActivityLog;
exports.activityLogMutationHandler = {
    createActivityLog: exports.createActivityLog,
    deleteActivityLog: exports.deleteActivityLog,
};
