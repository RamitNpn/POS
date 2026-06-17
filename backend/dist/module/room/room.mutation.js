"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomMutationHandler = exports.removeRoom = exports.updateRoom = exports.createRoom = void 0;
const room_repository_1 = __importDefault(require("../../repository/room.repository"));
const createRoom = async ({ req }) => {
    try {
        const { name, description, isActive } = req.body;
        const existingRoom = await room_repository_1.default.getByName(name);
        if (existingRoom) {
            return {
                status: 400,
                body: {
                    success: false,
                    error: "Room already exists",
                },
            };
        }
        await room_repository_1.default.create({
            name,
            description,
            isActive,
        });
        return {
            status: 201,
            body: {
                success: true,
                message: "Room created successfully",
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
exports.createRoom = createRoom;
const updateRoom = async ({ req }) => {
    try {
        const { roomID } = req.params;
        const room = await room_repository_1.default.getByID(roomID);
        if (!room) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Room not found",
                },
            };
        }
        const { name, description, isActive } = req.body;
        if (name && name !== room.name) {
            const exists = await room_repository_1.default.getByName(name);
            if (exists) {
                return {
                    status: 400,
                    body: {
                        success: false,
                        error: "Room already exists",
                    },
                };
            }
        }
        await room_repository_1.default.update(roomID, {
            name,
            description,
            isActive,
        });
        return {
            status: 200,
            body: {
                success: true,
                message: "Room updated successfully",
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
exports.updateRoom = updateRoom;
const removeRoom = async ({ req }) => {
    try {
        const { roomID } = req.params;
        const room = await room_repository_1.default.getByID(roomID);
        if (!room) {
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Room not found",
                },
            };
        }
        await room_repository_1.default.delete(roomID);
        return {
            status: 200,
            body: {
                success: true,
                message: "Room deleted successfully",
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
exports.removeRoom = removeRoom;
exports.roomMutationHandler = {
    createRoom: exports.createRoom,
    updateRoom: exports.updateRoom,
    removeRoom: exports.removeRoom,
};
