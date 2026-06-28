"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationMutationHandler = exports.deleteReservation = exports.updateReservation = exports.createReservation = void 0;
const reservation_repository_1 = __importDefault(require("../../repository/reservation.repository"));
const mongoose_1 = __importDefault(require("mongoose"));
const table_repository_1 = __importDefault(require("../../repository/table.repository"));
const log_repository_1 = __importDefault(require("../../repository/log.repository"));
const createReservation = async ({ req }) => {
    try {
        console.log("[CREATE RESERVATION] BODY:", req.body);
        const table = await table_repository_1.default.getByID(req.body.tableId);
        console.log("[CREATE RESERVATION] TABLE LOOKUP:", {
            tableId: req.body.tableId,
            found: !!table,
        });
        if (!table) {
            console.warn("[CREATE RESERVATION] TABLE NOT FOUND:", req.body.tableId);
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Table not found",
                },
            };
        }
        console.log("[CREATE RESERVATION] CREATING RESERVATION...");
        const data = await reservation_repository_1.default.create({
            ...req.body,
            tableId: new mongoose_1.default.Types.ObjectId(req.body.tableId),
        });
        console.log("[CREATE RESERVATION] CREATED:", data?._id);
        if (data) {
            const log = await log_repository_1.default.create({
                userId: new mongoose_1.default.Types.ObjectId(req.user?.id),
                action: "Reservation Create",
                details: `Reservation created at ${new Date().toLocaleString("en-US", {
                    timeZone: "Asia/Kathmandu",
                })}`,
                module: "Reservation",
                entityId: `${data._id}`,
                entityType: "",
            });
            if (!log) {
                console.log("User log not created", log);
            }
        }
        const status = "reserved";
        console.log("[CREATE RESERVATION] UPDATING TABLE STATUS:", {
            tableId: req.body.tableId,
            status,
        });
        const updated = await table_repository_1.default.updateStatus(req.body.tableId, status);
        if (!updated) {
            console.error("[CREATE RESERVATION] TABLE UPDATE FAILED");
            return {
                status: 404,
                body: {
                    success: false,
                    message: "Table was not updated",
                    error: "Table was not updated",
                },
            };
        }
        console.log("[CREATE RESERVATION] SUCCESS");
        if (updated) {
            const log = await log_repository_1.default.create({
                userId: new mongoose_1.default.Types.ObjectId(req.user?.id),
                action: "Update",
                details: `Table ${updated.name} reserved at ${new Date().toLocaleString("en-US", {
                    timeZone: "Asia/Kathmandu",
                })}`,
                module: "Table",
                entityId: `${req.body.tableId}`,
                entityType: "",
            });
            if (!log) {
                console.log("User log not created", log);
            }
        }
        return {
            status: 201,
            body: {
                success: true,
                message: "Reservation created successfully",
            },
        };
    }
    catch (error) {
        console.error("[CREATE RESERVATION] ERROR:", error);
        console.error("[CREATE RESERVATION] BODY:", req.body);
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.createReservation = createReservation;
const updateReservation = async ({ req }) => {
    try {
        console.log("[UPDATE RESERVATION] PARAMS:", req.params);
        console.log("[UPDATE RESERVATION] BODY:", req.body);
        const reservation = await reservation_repository_1.default.getByID(req.params.reservationId);
        console.log("[UPDATE RESERVATION] EXISTING RESERVATION:", {
            found: !!reservation,
        });
        if (!reservation) {
            console.warn("[UPDATE RESERVATION] RESERVATION NOT FOUND:", req.params.reservationId);
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Reservation not found",
                },
            };
        }
        const data = await reservation_repository_1.default.update(req.params.reservationId, {
            ...req.body,
            tableId: new mongoose_1.default.Types.ObjectId(req.body.tableId),
        });
        console.log("[UPDATE RESERVATION] RESULT:", data?._id);
        if (data) {
            return {
                status: 200,
                body: {
                    success: true,
                    message: "Reservation updated successfully",
                },
            };
        }
        console.warn("[UPDATE RESERVATION] NOT FOUND:", req.params.reservationId);
        const log = await log_repository_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(req.user?.id),
            action: "Create",
            details: `Reservation created at ${new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kathmandu",
            })}`,
            module: "Reservation",
            entityId: `${req.params.reservationId}`,
            entityType: "",
        });
        if (!log) {
            console.log("User log not created", log);
        }
        return {
            status: 401,
            body: {
                success: false,
                message: "Reservation updated failed",
            },
        };
    }
    catch (error) {
        console.error("[UPDATE RESERVATION] ERROR:", error);
        console.error("[UPDATE RESERVATION] PARAMS:", req.params);
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.updateReservation = updateReservation;
const deleteReservation = async ({ req }) => {
    try {
        console.log("[DELETE RESERVATION] PARAMS:", req.params);
        const log = await log_repository_1.default.create({
            userId: new mongoose_1.default.Types.ObjectId(req.user?.id),
            action: "Delete",
            details: `Reservation deleted at ${new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kathmandu",
            })}`,
            module: "Reservation",
            entityId: `${req.params.reservationId}`,
            entityType: "",
        });
        if (!log) {
            console.log("User log not created", log);
        }
        const result = await reservation_repository_1.default.delete(req.params.reservationId);
        console.log("[DELETE RESERVATION] RESULT:", result);
        return {
            status: 200,
            body: {
                success: true,
            },
        };
    }
    catch (error) {
        console.error("[DELETE RESERVATION] ERROR:", error);
        console.error("[DELETE RESERVATION] PARAMS:", req.params);
        return {
            status: 500,
            body: {
                success: false,
                error: error.message,
            },
        };
    }
};
exports.deleteReservation = deleteReservation;
exports.reservationMutationHandler = {
    createReservation: exports.createReservation,
    updateReservation: exports.updateReservation,
    deleteReservation: exports.deleteReservation,
};
