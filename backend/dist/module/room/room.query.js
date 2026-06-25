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
        console.log("[getAllRooms] incoming req.query:", req.query);
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);
        const search = req.query.search;
        const skip = (page - 1) * limit;
        console.log("[getAllRooms] parsed params:", {
            page,
            limit,
            search,
            skip,
        });
        const result = await room_repository_1.default.getAll({
            skip,
            limit,
            search,
        });
        console.log("[getAllRooms] repository result:", result);
        const formattedData = await Promise.all(result.data.map(async (room) => {
            console.log("[getAllRooms] processing room:", room);
            const roomId = room._id.toString();
            console.log("[getAllRooms] roomId:", roomId);
            const tableCount = await table_repository_1.default.countByRoom(roomId);
            console.log("[getAllRooms] tableCount:", {
                roomId,
                tableCount,
            });
            return {
                _id: roomId,
                name: room.name,
                description: room.description,
                tableCount,
                isActive: room.isActive,
            };
        }));
        console.log("[getAllRooms] formattedData:", formattedData);
        return {
            status: 200,
            body: {
                data: formattedData,
                pagination: {
                    page,
                    limit,
                    total: result.total,
                    totalPages: Math.ceil(result.total / limit),
                },
            },
        };
    }
    catch (error) {
        console.error("[getAllRooms] ERROR:", error);
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
        console.log("[getRoomByID] req.params:", req.params);
        const { roomID } = req.params;
        console.log("[getRoomByID] roomID:", roomID);
        const room = await room_repository_1.default.getByID(roomID);
        console.log("[getRoomByID] repository room:", room);
        if (!room) {
            console.log("[getRoomByID] room NOT FOUND");
            return {
                status: 404,
                body: {
                    success: false,
                    error: "Room not found",
                },
            };
        }
        const roomIdStr = room._id.toString();
        console.log("[getRoomByID] resolved roomId:", roomIdStr);
        const tableCount = await table_repository_1.default.countByRoom(roomIdStr);
        console.log("[getRoomByID] tableCount:", tableCount);
        return {
            status: 200,
            body: {
                _id: roomIdStr,
                name: room.name,
                description: room.description,
                tableCount,
                isActive: room.isActive,
            },
        };
    }
    catch (error) {
        console.error("[getRoomByID] ERROR:", error);
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
