import { AppRouteMutationImplementation } from "@ts-rest/express";
import reservationRepository from "../../repository/reservation.repository";
import { reservationContract } from "../../contract/reservation/reservation.contract";
import mongoose from "mongoose";
import tableRepository from "../../repository/table.repository";
import logRepository from "../../repository/log.repository";

export const createReservation: AppRouteMutationImplementation<
  typeof reservationContract.createReservation
> = async ({ req }) => {
  try {
    console.log("[CREATE RESERVATION] BODY:", req.body);

    const table = await tableRepository.getByID(req.body.tableId);

    console.log("[CREATE RESERVATION] TABLE LOOKUP:", {
      tableId: req.body.tableId,
      found: !!table,
    });

    if (!table) {
      console.warn("[CREATE RESERVATION] TABLE NOT FOUND:", req.body.tableId);

      return {
        status: 404,
        body: {
          success: false,
          error: "Table not found",
        },
      };
    }

    console.log("[CREATE RESERVATION] CREATING RESERVATION...");

    const data = await reservationRepository.create({
      ...req.body,
      tableId: new mongoose.Types.ObjectId(req.body.tableId),
    });

    console.log("[CREATE RESERVATION] CREATED:", data?._id);

    if (data) {
      const log = await logRepository.create({
        userId: new mongoose.Types.ObjectId(req.user?.id),
        action: "Reservation Create",
        details: `Reservation created at ${new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kathmandu",
        })}`,
        module: "Reservation",
        entityId: `${data._id}`,
        entityType: "",
      });

      if (!log) {
        console.log("User log not created", log);
      }
    }

    const status = "reserved";

    console.log("[CREATE RESERVATION] UPDATING TABLE STATUS:", {
      tableId: req.body.tableId,
      status,
    });

    const updated = await tableRepository.updateStatus(
      req.body.tableId,
      status,
    );

    if (!updated) {
      console.error("[CREATE RESERVATION] TABLE UPDATE FAILED");

      return {
        status: 404,
        body: {
          success: false,
          message: "Table was not updated",
          error: "Table was not updated",
        },
      };
    }

    console.log("[CREATE RESERVATION] SUCCESS");

    if (updated) {
      const log = await logRepository.create({
        userId: new mongoose.Types.ObjectId(req.user?.id),
        action: "Update",
        details: `Table ${updated.name} reserved at ${new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kathmandu",
        })}`,
        module: "Table",
        entityId: `${req.body.tableId}`,
        entityType: "",
      });

      if (!log) {
        console.log("User log not created", log);
      }
    }

    return {
      status: 201,
      body: {
        success: true,
        message: "Reservation created successfully",
      },
    };
  } catch (error) {
    console.error("[CREATE RESERVATION] ERROR:", error);
    console.error("[CREATE RESERVATION] BODY:", req.body);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const updateReservation: AppRouteMutationImplementation<
  typeof reservationContract.updateReservation
> = async ({ req }) => {
  try {
    console.log("[UPDATE RESERVATION] PARAMS:", req.params);
    console.log("[UPDATE RESERVATION] BODY:", req.body);

    const reservation = await reservationRepository.getByID(
      req.params.reservationId,
    );

    console.log("[UPDATE RESERVATION] EXISTING RESERVATION:", {
      found: !!reservation,
    });

    if (!reservation) {
      console.warn(
        "[UPDATE RESERVATION] RESERVATION NOT FOUND:",
        req.params.reservationId,
      );

      return {
        status: 404,
        body: {
          success: false,
          error: "Reservation not found",
        },
      };
    }

    const data = await reservationRepository.update(req.params.reservationId, {
      ...req.body,
      tableId: new mongoose.Types.ObjectId(req.body.tableId),
    });

    console.log("[UPDATE RESERVATION] RESULT:", data?._id);

    if (data) {
      return {
        status: 200,
        body: {
          success: true,
          message: "Reservation updated successfully",
        },
      };
    }

    console.warn("[UPDATE RESERVATION] NOT FOUND:", req.params.reservationId);

    const log = await logRepository.create({
      userId: new mongoose.Types.ObjectId(req.user?.id),
      action: "Create",
      details: `Reservation created at ${new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kathmandu",
      })}`,
      module: "Reservation",
      entityId: `${req.params.reservationId}`,
      entityType: "",
    });

    if (!log) {
      console.log("User log not created", log);
    }

    return {
      status: 401,
      body: {
        success: false,
        message: "Reservation updated failed",
      },
    };
  } catch (error) {
    console.error("[UPDATE RESERVATION] ERROR:", error);
    console.error("[UPDATE RESERVATION] PARAMS:", req.params);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const deleteReservation: AppRouteMutationImplementation<
  typeof reservationContract.deleteReservation
> = async ({ req }) => {
  try {
    console.log("[DELETE RESERVATION] PARAMS:", req.params);

    const log = await logRepository.create({
      userId: new mongoose.Types.ObjectId(req.user?.id),
      action: "Delete",
      details: `Reservation deleted at ${new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kathmandu",
      })}`,
      module: "Reservation",
      entityId: `${req.params.reservationId}`,
      entityType: "",
    });

    if (!log) {
      console.log("User log not created", log);
    }

    const result = await reservationRepository.delete(req.params.reservationId);

    console.log("[DELETE RESERVATION] RESULT:", result);

    return {
      status: 200,
      body: {
        success: true,
      },
    };
  } catch (error) {
    console.error("[DELETE RESERVATION] ERROR:", error);
    console.error("[DELETE RESERVATION] PARAMS:", req.params);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const reservationMutationHandler = {
  createReservation,
  updateReservation,
  deleteReservation,
};
