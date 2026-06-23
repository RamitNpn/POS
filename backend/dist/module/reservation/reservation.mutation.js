"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationMutationHandler = exports.deleteReservation = exports.updateReservation = exports.createReservation = void 0;
const reservation_repository_1 = __importDefault(require("../../repository/reservation.repository"));
const mongoose_1 = __importDefault(require("mongoose"));
const table_repository_1 = __importDefault(require("../../repository/table.repository"));
const createReservation = async ({ req }) => {
    try {
        const table = await table_repository_1.default.getByID(req.body.tableId);
        if (!table) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Table not found",
                },
            };
        }
        const data = await reservation_repository_1.default.create({
            ...req.body,
            tableId: new mongoose_1.default.Types.ObjectId(req.body.tableId),
        });
        const status = "reserved";
        const updated = await table_repository_1.default.updateStatus(req.body.tableId, status);
        if (!updated) {
            return {
                status: 404,
                body: {
                    success: false,
                    message: "Table was not updated",
                    error: "Table was not updated",
                },
            };
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
        const data = await reservation_repository_1.default.update(req.params.reservationId, {
            ...req.body,
            tableId: new mongoose_1.default.Types.ObjectId(req.body.tableId),
        });
        if (data) {
            return {
                status: 200,
                body: {
                    success: true,
                    message: "Reservation updated successfully",
                },
            };
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
    await reservation_repository_1.default.delete(req.params.reservationId);
    return {
        status: 200,
        body: {
            success: true,
        },
    };
};
exports.deleteReservation = deleteReservation;
exports.reservationMutationHandler = {
    createReservation: exports.createReservation,
    updateReservation: exports.updateReservation,
    deleteReservation: exports.deleteReservation,
};
