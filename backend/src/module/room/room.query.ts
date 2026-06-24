import { AppRouteQueryImplementation } from "@ts-rest/express";
import { roomContract } from "../../contract/room/room.contract";
import roomRepository from "../../repository/room.repository";
import tableRepository from "../../repository/table.repository";

export const getAllRooms: AppRouteQueryImplementation<
  typeof roomContract.getAllRooms
> = async ({ req }) => {
  try {
    console.log("[getAllRooms] incoming req.query:", req.query);

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const search = req.query.search as string | undefined;

    const skip = (page - 1) * limit;

    console.log("[getAllRooms] parsed params:", {
      page,
      limit,
      search,
      skip,
    });

    const result = await roomRepository.getAll({
      skip,
      limit,
      search,
    });

    console.log("[getAllRooms] repository result:", result);

    const formattedData = await Promise.all(
      result.data.map(async (room) => {
        console.log("[getAllRooms] processing room:", room);

        const roomId = room._id.toString();

        console.log("[getAllRooms] roomId:", roomId);

        const tableCount = await tableRepository.countByRoom(roomId);

        console.log("[getAllRooms] tableCount:", {
          roomId,
          tableCount,
        });

        return {
          _id: roomId,
          name: room.name,
          description: room.description,
          tableCount,
          isActive: room.isActive,
        };
      }),
    );

    console.log("[getAllRooms] formattedData:", formattedData);

    return {
      status: 200,
      body: {
        data: formattedData,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      },
    };
  } catch (error) {
    console.error("[getAllRooms] ERROR:", error);

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
    console.log("[getRoomByID] req.params:", req.params);

    const { roomID } = req.params;

    console.log("[getRoomByID] roomID:", roomID);

    const room = await roomRepository.getByID(roomID);

    console.log("[getRoomByID] repository room:", room);

    if (!room) {
      console.log("[getRoomByID] room NOT FOUND");

      return {
        status: 404,
        body: {
          success: false,
          error: "Room not found",
        },
      };
    }

    const roomIdStr = room._id.toString();

    console.log("[getRoomByID] resolved roomId:", roomIdStr);

    const tableCount = await tableRepository.countByRoom(roomIdStr);

    console.log("[getRoomByID] tableCount:", tableCount);

    return {
      status: 200,
      body: {
        _id: roomIdStr,
        name: room.name,
        description: room.description,
        tableCount,
        isActive: room.isActive,
      },
    };
  } catch (error) {
    console.error("[getRoomByID] ERROR:", error);

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