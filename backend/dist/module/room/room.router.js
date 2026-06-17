"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomRouter = void 0;
const express_1 = require("@ts-rest/express");
const room_contract_1 = require("../../contract/room/room.contract");
const room_mutation_1 = require("./room.mutation");
const room_query_1 = require("./room.query");
const s = (0, express_1.initServer)();
exports.roomRouter = s.router(room_contract_1.roomContract, {
    createRoom: room_mutation_1.roomMutationHandler.createRoom,
    updateRoom: room_mutation_1.roomMutationHandler.updateRoom,
    removeRoom: room_mutation_1.roomMutationHandler.removeRoom,
    getAllRooms: room_query_1.roomQueryHandler.getAllRooms,
    getRoomByID: room_query_1.roomQueryHandler.getRoomByID,
});
