import { initServer } from "@ts-rest/express";

import { roomContract } from "../../contract/room/room.contract";
import { roomMutationHandler } from "./room.mutation";
import { roomQueryHandler } from "./room.query";

import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware";

const s = initServer();

export const roomRouter = s.router(roomContract, {
  createRoom: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: roomMutationHandler.createRoom,
  },

  updateRoom: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: roomMutationHandler.updateRoom,
  },

  removeRoom: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: roomMutationHandler.removeRoom as any,
  },

  getAllRooms: {
    middleware: [verifyToken, authorizeRoles("cashier", "waiter", "admin")],
    handler: roomQueryHandler.getAllRooms,
  },

  getRoomByID: {
    middleware: [verifyToken, authorizeRoles("cashier", "waiter", "admin")],
    handler: roomQueryHandler.getRoomByID,
  },
});
