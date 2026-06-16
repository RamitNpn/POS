import { AppRouteQueryImplementation } from "@ts-rest/express";
import kitchenTicketRepository from "../../repository/ticket.repository";
import { ticketContract } from "../../contract/ticket/ticket.contract";

const mapTicket = (ticket: any) => {
  return {
    _id: ticket._id.toString(),

    orderId:
      ticket.orderId?._id?.toString?.() ||
      ticket.orderId?.toString?.(),

    tableId:
      ticket.tableId?._id?.toString?.() ||
      ticket.tableId?.toString?.(),

    ticketNumber: ticket.ticketNumber,

    items: (ticket.items ?? []).map((i: any) => ({
      menuItemId:
        i.menuItemId?._id?.toString?.() ||
        i.menuItemId,

      name: i.name,
      quantity: i.quantity,
    })),

    printed: ticket.printed,

    status: ticket.status,

    createdAt: ticket.createdAt,
  };
};

export const getTicketById: AppRouteQueryImplementation<
  typeof ticketContract.getTicketByID
> = async ({ req }) => {
  try {
    const { ticketID } = req.params;

    const ticket =
      await kitchenTicketRepository.getByID(ticketID);

    if (!ticket) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Ticket not found",
        },
      };
    }

    return {
      status: 200,
      body: mapTicket(ticket),
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch ticket",
      },
    };
  }
};

export const getLiveTickets: AppRouteQueryImplementation<
  typeof ticketContract.getLiveTickets
> = async () => {
  try {
    const tickets =
      await kitchenTicketRepository.getAll({
        skip: 0,
        limit: 100,
        status: "pending",
      });

    return {
      status: 200,
      body: {
        data: tickets.data.map(mapTicket),
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error:
          "Failed to fetch tickets",
      },
    };
  }
};

export const getTicketsByOrder: AppRouteQueryImplementation<
  typeof ticketContract.getTicketsByOrder
> = async ({ req }) => {
  try {
    const { orderID } = req.params;

    const tickets =
      await kitchenTicketRepository.getByOrderID(orderID);

    if (!tickets || tickets.length === 0) {
      return {
        status: 404,
        body: {
          success: false,
          error: "No tickets found for this order",
        },
      };
    }

    return {
      status: 200,
      body: {
        data: tickets.map(mapTicket),
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch tickets",
      },
    };
  }
};

export const ticketQueryHandler = {
    getTicketById,
    getLiveTickets,
    getTicketsByOrder,
};