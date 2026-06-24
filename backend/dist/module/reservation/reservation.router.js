"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationRouter = void 0;
const express_1 = require("@ts-rest/express");
const reservation_mutation_1 = require("./reservation.mutation");
const reservation_query_1 = require("./reservation.query");
const reservation_contract_1 = require("../../contract/reservation/reservation.contract");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const s = (0, express_1.initServer)();
exports.reservationRouter = s.router(reservation_contract_1.reservationContract, {
    createReservation: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: reservation_mutation_1.reservationMutationHandler.createReservation,
    },
    updateReservation: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: reservation_mutation_1.reservationMutationHandler.updateReservation,
    },
    deleteReservation: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: reservation_mutation_1.reservationMutationHandler.deleteReservation,
    },
    getAllReservation: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: reservation_query_1.reservationQueryHandler.getAllReservation,
    },
    getReservationByID: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: reservation_query_1.reservationQueryHandler.getReservationByID,
    },
    getReservationStats: {
        middleware: [auth_middleware_1.verifyToken, (0, auth_middleware_1.authorizeRoles)("admin")],
        handler: reservation_query_1.reservationQueryHandler.getReservationStats,
    },
});
