import { AppRouteQueryImplementation } from "@ts-rest/express";
import reservationRepository from "../../repository/reservation.repository";
import { reservationContract } from "../../contract/reservation/reservation.contract";

export const mapReservation = (reservation: any) => {
  return {
    _id: reservation._id.toString(),
    customerName: reservation.customerName,
    customerPhone: reservation.customerPhone,
    date: reservation.date,
    time: reservation.time,
    partySize: reservation.partySize,

    tableId: reservation.tableId?._id?.toString() ?? null,

    table: reservation.tableId
      ? {
          _id: reservation.tableId._id?.toString(),
          name: reservation.tableId.name,
          capacity: reservation.tableId.capacity,
          status: reservation.tableId.status,
        }
      : null,

    status: reservation.status,
    createdAt: reservation.createdAt,
    updatedAt: reservation.updatedAt,
  };
};

export const getAllReservation: AppRouteQueryImplementation<
  typeof reservationContract.getAllReservation
> = async ({ req }) => {
  try {
    console.log("[GET ALL RESERVATIONS] QUERY:", req.query);

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit);
    const skip = (page - 1) * limit;

    console.log("[GET ALL RESERVATIONS] PAGINATION:", {
      page,
      limit,
      skip,
    });

    console.log("[GET ALL RESERVATIONS] FETCHING FROM DB...");

    const { data, total } = await reservationRepository.getAll({
      skip,
      limit,
      search: req.query.search as string,
      status: req.query.status as string,
      date: req.query.date as string,
    });

    console.log("[GET ALL RESERVATIONS] DB RESULT:", {
      count: data?.length,
      total,
    });

    const formattedData = data.map(mapReservation);

    console.log("[GET ALL RESERVATIONS] MAPPED RESULT COUNT:", formattedData.length);

    return {
      status: 200,
      body: {
        data: formattedData,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("[GET ALL RESERVATIONS] ERROR:", error);
    console.error("[GET ALL RESERVATIONS] QUERY:", req.query);

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch reservations",
      },
    };
  }
};

export const getReservationByID: AppRouteQueryImplementation<
  typeof reservationContract.getReservationByID
> = async ({ req }) => {
  try {
    console.log("[GET RESERVATION BY ID] PARAMS:", req.params);

    const reservation = await reservationRepository.getByID(
      req.params.reservationId,
    );

    console.log("[GET RESERVATION BY ID] RESULT:", reservation?._id);

    if (!reservation) {
      console.warn("[GET RESERVATION BY ID] NOT FOUND:", req.params.reservationId);

      return {
        status: 404,
        body: {
          success: false,
          error: "Reservation not found",
        },
      };
    }

    return {
      status: 200,
      body: mapReservation(reservation),
    };
  } catch (error) {
    console.error("[GET RESERVATION BY ID] ERROR:", error);
    console.error("[GET RESERVATION BY ID] PARAMS:", req.params);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const getReservationStats: AppRouteQueryImplementation<
  typeof reservationContract.getReservationStats
> = async () => {
  try {
    console.log("[GET RESERVATION STATS] FETCHING...");

    const stats = await reservationRepository.getStats();

    console.log("[GET RESERVATION STATS] RESULT:", stats);

    return {
      status: 200,
      body: stats,
    };
  } catch (error) {
    console.error("[GET RESERVATION STATS] ERROR:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch reservation stats",
      },
    };
  }
};

export const reservationQueryHandler = {
  getAllReservation,
  getReservationByID,
  getReservationStats,
};