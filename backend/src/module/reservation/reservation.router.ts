import { initServer } from "@ts-rest/express";

import { reservationMutationHandler } from "./reservation.mutation";
import { reservationQueryHandler } from "./reservation.query";
import { reservationContract } from "../../contract/reservation/reservation.contract";

import { verifyToken, authorizeRoles } from "../../middleware/auth.middleware";

const s = initServer();

export const reservationRouter = s.router(reservationContract, {
  createReservation: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: reservationMutationHandler.createReservation,
  },

  updateReservation: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: reservationMutationHandler.updateReservation,
  },

  deleteReservation: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: reservationMutationHandler.deleteReservation as any,
  },

  getAllReservation: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: reservationQueryHandler.getAllReservation,
  },

  getReservationByID: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: reservationQueryHandler.getReservationByID,
  },

  getReservationStats: {
    middleware: [verifyToken, authorizeRoles("admin")],
    handler: reservationQueryHandler.getReservationStats,
  },
});
