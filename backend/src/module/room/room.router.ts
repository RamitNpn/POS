import { initServer } from "@ts-rest/express";

import { roomContract } from "../../contract/room/room.contract";
import { roomMutationHandler } from "./room.mutation";
import { roomQueryHandler } from "./room.query";

const s = initServer();

export const roomRouter = s.router(roomContract, {
  createRoom: roomMutationHandler.createRoom,
  updateRoom: roomMutationHandler.updateRoom,
  removeRoom: roomMutationHandler.removeRoom,

  getAllRooms: roomQueryHandler.getAllRooms,
  getRoomByID: roomQueryHandler.getRoomByID,
});