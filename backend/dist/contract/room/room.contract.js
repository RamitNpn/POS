"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomContract = void 0;
const core_1 = require("@ts-rest/core");
const zod_1 = require("zod");
const room_schema_1 = require("./room.schema");
const commonSchema_1 = require("../commonSchema");
const c = (0, core_1.initContract)();
exports.roomContract = c.router({
    createRoom: {
        method: "POST",
        path: "/room",
        summary: "Create a new room",
        body: room_schema_1.createRoomSchema,
        responses: {
            201: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    getAllRooms: {
        method: "GET",
        path: "/room",
        summary: "Get a paginated list of rooms with optional search",
        query: zod_1.z.object({
            page: zod_1.z.coerce.number().optional(),
            limit: zod_1.z.coerce.number().optional(),
            search: zod_1.z.string().optional(),
        }),
        responses: {
            200: zod_1.z.object({
                data: room_schema_1.getAllRoomsSchema,
                pagination: zod_1.z.object({
                    page: zod_1.z.number(),
                    limit: zod_1.z.number(),
                    total: zod_1.z.number(),
                    totalPages: zod_1.z.number(),
                }),
            }),
            500: commonSchema_1.errorSchema,
        },
    },
    getRoomByID: {
        method: "GET",
        path: "/room/:roomID",
        summary: "Get room details by ID",
        pathParams: zod_1.z.object({
            roomID: zod_1.z.string(),
        }),
        responses: {
            200: room_schema_1.getRoomByIdSchema,
            404: commonSchema_1.errorSchema,
        },
    },
    updateRoom: {
        method: "PUT",
        path: "/room/:roomID",
        summary: "Update room details by ID",
        pathParams: zod_1.z.object({
            roomID: zod_1.z.string(),
        }),
        body: room_schema_1.updateRoomSchema,
        responses: {
            200: commonSchema_1.successSchema,
            400: commonSchema_1.errorSchema,
            404: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
    removeRoom: {
        method: "DELETE",
        path: "/room/:roomID",
        summary: "Remove a room by ID",
        pathParams: zod_1.z.object({
            roomID: zod_1.z.string(),
        }),
        body: zod_1.z.object({}),
        responses: {
            200: commonSchema_1.successSchema,
            404: commonSchema_1.errorSchema,
            500: commonSchema_1.errorSchema,
        },
    },
});
