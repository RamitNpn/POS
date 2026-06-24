"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomRouter = void 0;
const express_1 = require("@ts-rest/express");
const room_contract_1 = require("../../contract/room/room.contract");
const room_mutation_1 = require("./room.mutation");
const room_query_1 = require("./room.query");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const s = (0, express_1.initServer)();
exports.roomRouter = s.router(room_contract_1.roomContract, {
    createRoom: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: room_mutation_1.roomMutationHandler.createRoom,
    },
    updateRoom: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: room_mutation_1.roomMutationHandler.updateRoom,
    },
    removeRoom: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: room_mutation_1.roomMutationHandler.removeRoom,
    },
    getAllRooms: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("cashier", "waiter", "admin")],
        handler: room_query_1.roomQueryHandler.getAllRooms,
    },
    getRoomByID: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("cashier", "waiter", "admin")],
        handler: room_query_1.roomQueryHandler.getRoomByID,
    },
});
