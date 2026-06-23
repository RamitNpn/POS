"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityLogQueryHandler = exports.getActivityLogByID = exports.getAllActivityLogs = void 0;
const log_repository_1 = __importDefault(require("../../repository/log.repository"));
const getAllActivityLogs = async ({ req }) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit);
        const { data, total } = await log_repository_1.default.getAll({
            skip: (page - 1) * limit,
            limit,
            search: req.query.search,
            module: req.query.module,
            userId: req.query.userId,
        });
        const formatted = data.map((p) => ({
            _id: p._id.toString(),
            userId: p.userId?._id?.toString?.() ?? p.userId?.toString(),
            user: p.userId
                ? {
                    name: p.userId.name,
                    email: p.userId.email,
                    role: p.userId.role,
                }
                : undefined,
            action: p.action,
            details: p.details,
            module: p.module,
            entityId: p.entityId,
            entityType: p.entityType,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        }));
        return {
            status: 200,
            body: {
                data: formatted,
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
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.getAllActivityLogs = getAllActivityLogs;
const getActivityLogByID = async ({ req }) => {
    try {
        const log = (await log_repository_1.default.getByID(req.params.logId));
        if (!log) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Activity log not found",
                },
            };
        }
        const user = log.userId;
        return {
            status: 200,
            body: {
                _id: log._id.toString(),
                userId: user?._id?.toString(),
                user: user
                    ? {
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    }
                    : undefined,
                action: log.action,
                details: log.details,
                module: log.module,
                entityId: log.entityId,
                entityType: log.entityType,
                createdAt: log.createdAt,
                updatedAt: log.updatedAt,
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
exports.getActivityLogByID = getActivityLogByID;
exports.activityLogQueryHandler = {
    getAllActivityLogs: exports.getAllActivityLogs,
    getActivityLogByID: exports.getActivityLogByID,
};
