import { AppRouteMutationImplementation } from "@ts-rest/express";
import kitchenTicketRepository from "../../repository/ticket.repository";
import { ticketContract } from "../../contract/ticket/ticket.contract";

export const updateTicketStatus: AppRouteMutationImplementation<
  typeof ticketContract.updateTicketStatus
> = async ({ req }) => {
  try {
    const { ticketID } = req.params;
    const { status } = req.body;

    const ticket = await kitchenTicketRepository.getByID(ticketID);

    if (!ticket) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Ticket not found",
        },
      };
    }

    const updated = await kitchenTicketRepository.updateStatus(
      ticketID,
      status,
    );

    return {
      status: 200,
      body: {
        success: true,
        message: "Ticket updated",
        data: updated,
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const removeTicket: AppRouteMutationImplementation<
  typeof ticketContract.removeTicket
> = async ({ req }) => {
  try {
    const { ticketID } = req.params;

    const ticket = await kitchenTicketRepository.getByID(ticketID);

    if (!ticket) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Ticket not found",
        },
      };
    }

    // SAFER OPTION: mark as cancelled
    await kitchenTicketRepository.updateStatus(ticketID, "cancelled");

    return {
      status: 200,
      body: {
        success: true,
        message: "Ticket cancelled",
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to delete ticket",
      },
    };
  }
};

export const ticketMutationHandler = {
  updateTicketStatus,
  removeTicket,
};
