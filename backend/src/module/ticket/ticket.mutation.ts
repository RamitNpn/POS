import { AppRouteMutationImplementation } from "@ts-rest/express";
import kitchenTicketRepository from "../../repository/ticket.repository";
import { ticketContract } from "../../contract/ticket/ticket.contract";

export const updateTicketStatus: AppRouteMutationImplementation<
  typeof ticketContract.updateTicketStatus
> = async ({ req }) => {
  try {
    const { ticketID } = req.params;
    const { status } = req.body;

    console.log("[updateTicketStatus] ticketID:", ticketID);
    console.log("[updateTicketStatus] requested status:", status);

    const ticket = await kitchenTicketRepository.getByID(ticketID);

    console.log("[updateTicketStatus] existing ticket:", ticket);

    if (!ticket) {
      console.log("[updateTicketStatus] ticket not found");

      return {
        status: 404,
        body: {
          success: false,
          error: "Ticket not found",
        },
      };
    }

    console.log("[updateTicketStatus] current status:", ticket.status);

    const updated = await kitchenTicketRepository.updateStatus(
      ticketID,
      status,
    );

    console.log("[updateTicketStatus] updated ticket:", updated);

    return {
      status: 200,
      body: {
        success: true,
        message: "Ticket updated",
        data: updated,
      },
    };
  } catch (error) {
    console.error("[updateTicketStatus] error:", error);

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

    console.log("[removeTicket] ticketID:", ticketID);

    const ticket = await kitchenTicketRepository.getByID(ticketID);

    console.log("[removeTicket] existing ticket:", ticket);

    if (!ticket) {
      console.log("[removeTicket] ticket not found");

      return {
        status: 404,
        body: {
          success: false,
          error: "Ticket not found",
        },
      };
    }

    console.log("[removeTicket] current status:", ticket.status);

    const cancelled = await kitchenTicketRepository.updateStatus(
      ticketID,
      "cancelled",
    );

    console.log("[removeTicket] cancelled ticket:", cancelled);

    return {
      status: 200,
      body: {
        success: true,
        message: "Ticket cancelled",
      },
    };
  } catch (error) {
    console.error("[removeTicket] error:", error);

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
