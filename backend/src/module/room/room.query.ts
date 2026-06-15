import { AppRouteQueryImplementation } from "@ts-rest/express";
import { roomContract } from "../../contract/room/room.contract";
import roomRepository from "../../repository/room.repository";
import tableRepository from "../../repository/table.repository";

export const getAllRooms: AppRouteQueryImplementation<
  typeof roomContract.getAllRooms
> = async ({ req }) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const search = req.query.search as string | undefined;

    const skip = (page - 1) * limit;

    const { data, total } = await roomRepository.getAll({
      skip,
      limit,
      search,
    });

    const formattedData = await Promise.all(
      data.map(async (room) => {
        const tableCount = await tableRepository.countByRoom(
          room._id.toString(),
        );

        return {
          _id: room._id.toString(),
          name: room.name,
          description: room.description,
          tableCount,
          isActive: room.isActive,
        };
      }),
    );

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
  } catch {
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch rooms",
      },
    };
  }
};

export const getRoomByID: AppRouteQueryImplementation<
  typeof roomContract.getRoomByID
> = async ({ req }) => {
  try {
    const { roomID } = req.params;

    const room = await roomRepository.getByID(roomID);

    if (!room) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Room not found",
        },
      };
    }

    const tableCount = await roomRepository.countByRoom(room._id.toString());

    return {
      status: 200,
      body: {
        _id: room._id.toString(),
        name: room.name,
        description: room.description,
        tableCount: tableCount,
        isActive: room.isActive,
      },
    };
  } catch {
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch room",
      },
    };
  }
};

export const roomQueryHandler = {
  getAllRooms,
  getRoomByID,
};
