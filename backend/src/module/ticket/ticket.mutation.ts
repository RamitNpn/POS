import { AppRouteMutationImplementation } from "@ts-rest/express";
import kitchenTicketRepository from "../../repository/ticket.repository";
import { ticketContract } from "../../contract/ticket/ticket.contract";
import logRepository from "../../repository/log.repository";
import mongoose from "mongoose";
import { IOrder } from "../../model/order.model";

export const updateTicketItems: AppRouteMutationImplementation<
  typeof ticketContract.updateTicketItems
> = async ({ req }) => {
  try {
    const { ticketID } = req.params;
    const { items } = req.body;

    console.log("[updateTicketItems]", {
      ticketID,
      itemCount: items.length,
    });

    const existing = await kitchenTicketRepository.getByID(ticketID);

    console.log("[updateTicketStatus] existing ticket:", existing);

    if (!existing) {
      console.log("[updateTicketStatus] ticket not found");

      return {
        status: 404,
        body: {
          success: false,
          error: "Ticket not found",
        },
      };
    }

    const ticket = await kitchenTicketRepository.updateTicketItems(
      ticketID,
      items,
    );

    if (!ticket) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Ticket not found",
        },
      };
    }

    const order = existing.orderId as unknown as IOrder;

    const log = await logRepository.create({
      userId: new mongoose.Types.ObjectId(req.user?.id),
      action: "Update",
      details: `Items updated in Order ${order.orderNumber} Ticket ${existing.ticketNumber} at ${new Date().toLocaleString(
        "en-US",
        {
          timeZone: "Asia/Kathmandu",
        },
      )}`,
      module: "Ticket",
      entityId: `${ticketID}`,
      entityType: "",
    });

    if (!log) {
      console.log("User log not created", log);
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Ticket updated successfully.",
      },
    };
  } catch (error) {
    console.error("[updateTicketItems]", error);

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to update ticket.",
      },
    };
  }
};

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

    const order = ticket.orderId as unknown as IOrder;

    const log = await logRepository.create({
      userId: new mongoose.Types.ObjectId(req.user?.id),
      action: "Update",
      details: `Ticket status updated in Order ${order.orderNumber} Ticket ${ticket.ticketNumber} at ${new Date().toLocaleString(
        "en-US",
        {
          timeZone: "Asia/Kathmandu",
        },
      )}`,
      module: "Ticket",
      entityId: `${ticketID}`,
      entityType: "",
    });

    if (!log) {
      console.log("User log not created", log);
    }

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

    const order = ticket.orderId as unknown as IOrder;

    const log = await logRepository.create({
      userId: new mongoose.Types.ObjectId(req.user?.id),
      action: "Delete",
      details: `Ticket ${ticket.ticketNumber}cancelled in Order ${order.orderNumber} at ${new Date().toLocaleString(
        "en-US",
        {
          timeZone: "Asia/Kathmandu",
        },
      )}`,
      module: "Ticket",
      entityId: `${ticketID}`,
      entityType: "",
    });

    if (!log) {
      console.log("User log not created", log);
    }

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
  updateTicketItems,
  updateTicketStatus,
  removeTicket,
};
