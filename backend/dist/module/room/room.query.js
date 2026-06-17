"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomQueryHandler = exports.getRoomByID = exports.getAllRooms = void 0;
const room_repository_1 = __importDefault(require("../../repository/room.repository"));
const table_repository_1 = __importDefault(require("../../repository/table.repository"));
const getAllRooms = async ({ req }) => {
    try {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const search = req.query.search;
        const skip = (page - 1) * limit;
        const { data, total } = await room_repository_1.default.getAll({
            skip,
            limit,
            search,
        });
        const formattedData = await Promise.all(data.map(async (room) => {
            const tableCount = await table_repository_1.default.countByRoom(room._id.toString());
            return {
                _id: room._id.toString(),
                name: room.name,
                description: room.description,
                tableCount,
                isActive: room.isActive,
            };
        }));
        return {
            status: 200,
            body: {
                data: formattedData,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        };
    }
    catch {
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to fetch rooms",
            },
        };
    }
};
exports.getAllRooms = getAllRooms;
const getRoomByID = async ({ req }) => {
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
        const tableCount = await room_repository_1.default.countByRoom(room._id.toString());
        return {
            status: 200,
            body: {
                _id: room._id.toString(),
                name: room.name,
                description: room.description,
                tableCount: tableCount,
                isActive: room.isActive,
            },
        };
    }
    catch {
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to fetch room",
            },
        };
    }
};
exports.getRoomByID = getRoomByID;
exports.roomQueryHandler = {
    getAllRooms: exports.getAllRooms,
    getRoomByID: exports.getRoomByID,
};
