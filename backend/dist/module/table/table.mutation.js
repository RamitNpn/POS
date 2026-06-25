"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableMutationHandler = exports.removeTable = exports.updateTableStatus = exports.updateTable = exports.createTable = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const table_repository_1 = __importDefault(require("../../repository/table.repository"));
const ticket_repository_1 = __importDefault(require("../../repository/ticket.repository"));
const reservation_repository_1 = __importDefault(require("../../repository/reservation.repository"));
const createTable = async ({ req }) => {
    try {
        console.log("[createTable] request body:", req.body);
        const existing = await table_repository_1.default.getByName(req.body.name);
        console.log("[createTable] existing table:", existing);
        if (existing) {
            console.log("[createTable] duplicate table name:", req.body.name);
            return {
                status: 400,
                body: {
                    success: false,
                    error: "Table name already exists",
                },
            };
        }
        const payload = {
            ...req.body,
            sectionId: new mongoose_1.default.Types.ObjectId(req.body.sectionId),
        };
        console.log("[createTable] create payload:", payload);
        const created = await table_repository_1.default.create(payload);
        console.log("[createTable] created table:", created);
        return {
            status: 201,
            body: {
                success: true,
                message: "Table created successfully",
            },
        };
    }
    catch (error) {
        console.error("[createTable] error:", error);
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
        console.log("[updateTable] tableID:", tableID);
        console.log("[updateTable] request body:", req.body);
        const table = await table_repository_1.default.getByID(tableID);
        console.log("[updateTable] existing table:", table);
        if (!table) {
            console.log("[updateTable] table not found");
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Table not found",
                },
            };
        }
        if (req.body.name && req.body.name !== table.name) {
            console.log("[updateTable] checking duplicate name:", req.body.name);
            const exists = await table_repository_1.default.getByName(req.body.name);
            console.log("[updateTable] duplicate check result:", exists);
            if (exists) {
                console.log("[updateTable] duplicate table name found");
                return {
                    status: 400,
                    body: {
                        success: false,
                        error: "Table name already exists",
                    },
                };
            }
        }
        const payload = {
            ...req.body,
            sectionId: req.body.sectionId
                ? new mongoose_1.default.Types.ObjectId(req.body.sectionId)
                : undefined,
        };
        console.log("[updateTable] update payload:", payload);
        const updated = await table_repository_1.default.update(tableID, payload);
        console.log("[updateTable] updated table:", updated);
        return {
            status: 200,
            body: {
                success: true,
                message: "Table updated successfully",
            },
        };
    }
    catch (error) {
        console.error("[updateTable] error:", error);
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
const updateTableStatus = async ({ req }) => {
    try {
        const { tableID } = req.params;
        const { status } = req.body;
        console.log("[updateTableStatus] tableID:", tableID);
        console.log("[updateTableStatus] new status:", status);
        const table = await table_repository_1.default.getByID(tableID);
        console.log("[updateTableStatus] table:", table);
        if (!table) {
            console.log("[updateTableStatus] table not found");
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Table not found",
                },
            };
        }
        // Prevent unnecessary updates
        if (table.status === status) {
            console.log(`[updateTableStatus] table already has status: ${status}`);
            return {
                status: 400,
                body: {
                    success: false,
                    error: `Table is already ${status}`,
                },
            };
        }
        // Check active reservation before making table available
        if (status === "available") {
            const reservation = await reservation_repository_1.default.getActiveReservationForToday(tableID);
            if (reservation) {
                return {
                    status: 400,
                    body: {
                        success: false,
                        error: "Table has an active reservation",
                    },
                };
            }
        }
        const tickets = await ticket_repository_1.default.getByTableID(tableID);
        console.log("[updateTableStatus] tickets found:", tickets.length);
        console.log("[updateTableStatus] ticket statuses:", tickets.map((t) => ({
            id: t._id,
            status: t.status,
        })));
        const hasUnservedTickets = tickets.some((ticket) => ticket.status === "pending");
        console.log("[updateTableStatus] hasUnservedTickets:", hasUnservedTickets);
        if (hasUnservedTickets) {
            console.log("[updateTableStatus] blocked due to pending kitchen tickets");
            return {
                status: 400,
                body: {
                    success: false,
                    error: "Cannot change table status while there are pending kitchen tickets.",
                },
            };
        }
        const updated = await table_repository_1.default.updateStatus(tableID, status);
        console.log("[updateTableStatus] updated result:", updated);
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
        console.error("[updateTableStatus] error:", error);
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.updateTableStatus = updateTableStatus;
const removeTable = async ({ req }) => {
    try {
        const { tableID } = req.params;
        console.log("[removeTable] tableID:", tableID);
        const table = await table_repository_1.default.getByID(tableID);
        console.log("[removeTable] table:", table);
        if (!table) {
            console.log("[removeTable] table not found");
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Table not found",
                },
            };
        }
        const deleted = await table_repository_1.default.delete(tableID);
        console.log("[removeTable] delete result:", deleted);
        return {
            status: 200,
            body: {
                success: true,
                message: "Table deleted successfully",
            },
        };
    }
    catch (error) {
        console.error("[removeTable] error:", error);
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.removeTable = removeTable;
exports.tableMutationHandler = {
    createTable: exports.createTable,
    updateTable: exports.updateTable,
    updateTableStatus: exports.updateTableStatus,
    removeTable: exports.removeTable,
};
