import { AppRouteMutationImplementation } from "@ts-rest/express";
import mongoose from "mongoose";

import { tableContract } from "../../contract/table/table.contract";
import tableRepository from "../../repository/table.repository";
import ticketRepository from "../../repository/ticket.repository";
import reservationRepository from "../../repository/reservation.repository";

export const createTable: AppRouteMutationImplementation<
  typeof tableContract.createTable
> = async ({ req }) => {
  try {
    console.log("[createTable] request body:", req.body);

    const existing = await tableRepository.getByName(req.body.name);

    console.log("[createTable] existing table:", existing);

    if (existing) {
      console.log("[createTable] duplicate table name:", req.body.name);

      return {
        status: 400,
        body: {
          success: false,
          error: "Table name already exists",
        },
      };
    }

    const payload = {
      ...req.body,
      sectionId: new mongoose.Types.ObjectId(req.body.sectionId),
    };

    console.log("[createTable] create payload:", payload);

    const created = await tableRepository.create(payload);

    console.log("[createTable] created table:", created);

    return {
      status: 201,
      body: {
        success: true,
        message: "Table created successfully",
      },
    };
  } catch (error) {
    console.error("[createTable] error:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const updateTable: AppRouteMutationImplementation<
  typeof tableContract.updateTable
> = async ({ req }) => {
  try {
    const { tableID } = req.params;

    console.log("[updateTable] tableID:", tableID);
    console.log("[updateTable] request body:", req.body);

    const table = await tableRepository.getByID(tableID);

    console.log("[updateTable] existing table:", table);

    if (!table) {
      console.log("[updateTable] table not found");

      return {
        status: 404,
        body: {
          success: false,
          error: "Table not found",
        },
      };
    }

    if (req.body.name && req.body.name !== table.name) {
      console.log("[updateTable] checking duplicate name:", req.body.name);

      const exists = await tableRepository.getByName(req.body.name);

      console.log("[updateTable] duplicate check result:", exists);

      if (exists) {
        console.log("[updateTable] duplicate table name found");

        return {
          status: 400,
          body: {
            success: false,
            error: "Table name already exists",
          },
        };
      }
    }

    const payload = {
      ...req.body,
      sectionId: req.body.sectionId
        ? new mongoose.Types.ObjectId(req.body.sectionId)
        : undefined,
    };

    console.log("[updateTable] update payload:", payload);

    const updated = await tableRepository.update(tableID, payload);

    console.log("[updateTable] updated table:", updated);

    return {
      status: 200,
      body: {
        success: true,
        message: "Table updated successfully",
      },
    };
  } catch (error) {
    console.error("[updateTable] error:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const updateTableStatus: AppRouteMutationImplementation<
  typeof tableContract.updateTableStatus
> = async ({ req }) => {
  try {
    const { tableID } = req.params;
    const { status } = req.body;

    console.log("[updateTableStatus] tableID:", tableID);
    console.log("[updateTableStatus] new status:", status);

    const table = await tableRepository.getByID(tableID);

    console.log("[updateTableStatus] table:", table);

    if (!table) {
      console.log("[updateTableStatus] table not found");

      return {
        status: 404,
        body: {
          success: false,
          error: "Table not found",
        },
      };
    }

    // Prevent unnecessary updates
    if (table.status === status) {
      console.log(`[updateTableStatus] table already has status: ${status}`);

      return {
        status: 400,
        body: {
          success: false,
          error: `Table is already ${status}`,
        },
      };
    }

    // Check active reservation before making table available
    if (status === "available") {

      const reservation =
        await reservationRepository.getActiveReservationForToday(tableID);

      if (reservation) {
        return {
          status: 400,
          body: {
            success: false,
            error: "Table has an active reservation",
          },
        };
      }
    }

    const tickets = await ticketRepository.getByTableID(tableID);

    console.log("[updateTableStatus] tickets found:", tickets.length);
    console.log(
      "[updateTableStatus] ticket statuses:",
      tickets.map((t) => ({
        id: t._id,
        status: t.status,
      })),
    );

    const hasUnservedTickets = tickets.some(
      (ticket) => ticket.status === "pending",
    );

    console.log("[updateTableStatus] hasUnservedTickets:", hasUnservedTickets);

    if (hasUnservedTickets) {
      console.log("[updateTableStatus] blocked due to pending kitchen tickets");

      return {
        status: 400,
        body: {
          success: false,
          error:
            "Cannot change table status while there are pending kitchen tickets.",
        },
      };
    }

    const updated = await tableRepository.updateStatus(tableID, status);

    console.log("[updateTableStatus] updated result:", updated);

    return {
      status: 200,
      body: {
        success: true,
        message: "Table updated",
        data: updated,
      },
    };
  } catch (error) {
    console.error("[updateTableStatus] error:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const removeTable: AppRouteMutationImplementation<
  typeof tableContract.removeTable
> = async ({ req }) => {
  try {
    const { tableID } = req.params;

    console.log("[removeTable] tableID:", tableID);

    const table = await tableRepository.getByID(tableID);

    console.log("[removeTable] table:", table);

    if (!table) {
      console.log("[removeTable] table not found");

      return {
        status: 404,
        body: {
          success: false,
          error: "Table not found",
        },
      };
    }

    const deleted = await tableRepository.delete(tableID);

    console.log("[removeTable] delete result:", deleted);

    return {
      status: 200,
      body: {
        success: true,
        message: "Table deleted successfully",
      },
    };
  } catch (error) {
    console.error("[removeTable] error:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const tableMutationHandler = {
  createTable,
  updateTable,
  updateTableStatus,
  removeTable,
};
