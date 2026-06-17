"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableMutationHandler = exports.removeTable = exports.updateTicketStatus = exports.updateTable = exports.createTable = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const table_repository_1 = __importDefault(require("../../repository/table.repository"));
const createTable = async ({ req }) => {
    try {
        const existing = await table_repository_1.default.getByName(req.body.name);
        if (existing) {
            return {
                status: 400,
                body: {
                    success: false,
                    error: "Table name already exists",
                },
            };
        }
        await table_repository_1.default.create({
            ...req.body,
            sectionId: new mongoose_1.default.Types.ObjectId(req.body.sectionId)
        });
        return {
            status: 201,
            body: {
                success: true,
                message: "Table created successfully",
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
exports.createTable = createTable;
const updateTable = async ({ req }) => {
    try {
        const { tableID } = req.params;
        const table = await table_repository_1.default.getByID(tableID);
        if (!table) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Table not found",
                },
            };
        }
        if (req.body.name && req.body.name !== table.name) {
            const exists = await table_repository_1.default.getByName(req.body.name);
            if (exists) {
                return {
                    status: 400,
                    body: {
                        success: false,
                        error: "Table name already exists",
                    },
                };
            }
        }
        await table_repository_1.default.update(tableID, {
            ...req.body,
            sectionId: req.body.sectionId
                ? new mongoose_1.default.Types.ObjectId(req.body.sectionId)
                : undefined,
        });
        return {
            status: 200,
            body: {
                success: true,
                message: "Table updated successfully",
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
exports.updateTable = updateTable;
const updateTicketStatus = async ({ req }) => {
    try {
        const { tableID } = req.params;
        const { status } = req.body;
        const table = await table_repository_1.default.getByID(tableID);
        if (!table) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Table not found",
                },
            };
        }
        const updated = await table_repository_1.default.updateStatus(tableID, status);
        return {
            status: 200,
            body: {
                success: true,
                message: "Table updated",
                data: updated,
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
exports.updateTicketStatus = updateTicketStatus;
const removeTable = async ({ req }) => {
    const { tableID } = req.params;
    const table = await table_repository_1.default.getByID(tableID);
    if (!table) {
        return {
            status: 404,
            body: {
                success: false,
                error: "Table not found",
            },
        };
    }
    await table_repository_1.default.delete(tableID);
    return {
        status: 200,
        body: {
            success: true,
            message: "Table deleted successfully",
        },
    };
};
exports.removeTable = removeTable;
exports.tableMutationHandler = {
    createTable: exports.createTable,
    updateTable: exports.updateTable,
    updateTicketStatus: exports.updateTicketStatus,
    removeTable: exports.removeTable,
};
