"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketContract = void 0;
const core_1 = require("@ts-rest/core");
const zod_1 = require("zod");
const ticket_schema_1 = require("./ticket.schema");
const commonSchema_1 = require("../commonSchema");
const c = (0, core_1.initContract)();
exports.ticketContract = c.router({
    getLiveTickets: {
        method: "GET",
        path: "/ticket",
        query: zod_1.z.object({
            search: zod_1.z.string().optional(),
        }),
        responses: {
            200: zod_1.z.object({
                data: zod_1.z.array(ticket_schema_1.kitchenTicketSchema),
            }),
            500: commonSchema_1.errorSchema,
        },
    },
    getTicketByID: {
        method: "GET",
        path: "/ticket/:ticketID",
        pathParams: zod_1.z.object({
            ticketID: zod_1.z.string(),
        }),
        responses: {
            200: ticket_schema_1.getKitchenTicketByIdSchema,
            404: commonSchema_1.errorSchema,
        },
    },
    getTicketsByOrder: {
        method: "GET",
        path: "/ticket/order/:orderID",
        pathParams: zod_1.z.object({
            orderID: zod_1.z.string(),
        }),
        responses: {
            200: zod_1.z.object({
                data: ticket_schema_1.getAllKitchenTicketsSchema,
            }),
            404: commonSchema_1.errorSchema,
        },
    },
    updateTicketStatus: {
        method: "PUT",
        path: "/ticket/:ticketID",
        pathParams: zod_1.z.object({
            ticketID: zod_1.z.string(),
        }),
        body: ticket_schema_1.updateKitchenTicketSchema,
        responses: {
            200: commonSchema_1.successSchema,
            404: commonSchema_1.errorSchema,
        },
    },
    removeTicket: {
        method: "DELETE",
        path: "/ticket/:ticketID",
        pathParams: zod_1.z.object({
            ticketID: zod_1.z.string(),
        }),
        body: zod_1.z.object({}),
        responses: {
            200: commonSchema_1.successSchema,
            404: commonSchema_1.errorSchema,
        },
    },
});
