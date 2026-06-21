import { AppRouteMutationImplementation } from "@ts-rest/express";
import reservationRepository from "../../repository/reservation.repository";
import { reservationContract } from "../../contract/reservation/reservation.contract";
import mongoose from "mongoose";
import { getIO } from "../../utils/socket";

export const createReservation: AppRouteMutationImplementation<
  typeof reservationContract.createReservation
> = async ({ req }) => {
  try {
    const data = await reservationRepository.create({
      ...req.body,
      tableId: new mongoose.Types.ObjectId(req.body.tableId),
    });

    try {
      const io = getIO();
      io.emit("reservation:created", data);
    } catch (err) {
      console.error("Socket emit error in createReservation:", err);
    }

    return {
      status: 201,
      body: {
        success: true,
        message: "Reservation created successfully",
        data,
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

export const updateReservation: AppRouteMutationImplementation<
  typeof reservationContract.updateReservation
> = async ({ req }) => {
  try {
    const data = await reservationRepository.update(req.params.reservationId, {
      ...req.body,
      tableId: new mongoose.Types.ObjectId(req.body.tableId),
    });

    if (data) {
      try {
        const io = getIO();
        io.emit("reservation:updated", data);
      } catch (err) {
        console.error("Socket emit error in updateReservation:", err);
      }

      return {
        status: 200,
        body: {
          success: true,
          message: "Reservation updated successfully",
          data,
        },
      };
    }

    return {
      status: 401,
      body: {
        success: false,
        message: "Reservation updated failed",
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

export const deleteReservation: AppRouteMutationImplementation<
  typeof reservationContract.deleteReservation
> = async ({ req }) => {
  await reservationRepository.delete(req.params.reservationId);

  try {
    const io = getIO();
    io.emit("reservation:deleted", { _id: req.params.reservationId });
  } catch (err) {
    console.error("Socket emit error in deleteReservation:", err);
  }

  return {
    status: 200,
    body: {
      success: true,
    },
  };
};

export const reservationMutationHandler = {
  createReservation,
  updateReservation,
  deleteReservation,
};
