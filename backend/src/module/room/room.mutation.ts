import { AppRouteMutationImplementation } from "@ts-rest/express";
import { roomContract } from "../../contract/room/room.contract";
import roomRepository from "../../repository/room.repository";

export const createRoom: AppRouteMutationImplementation<
  typeof roomContract.createRoom
> = async ({ req }) => {
  try {
    const { name, description, tableCount, isActive } = req.body;

    const existingRoom = await roomRepository.getByName(name);

    if (existingRoom) {
      return {
        status: 400,
        body: {
          success: false,
          error: "Room already exists",
        },
      };
    }

    await roomRepository.create({
      name,
      description,
      tableCount,
      isActive,
    });

    return {
      status: 201,
      body: {
        success: true,
        message: "Room created successfully",
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

export const updateRoom: AppRouteMutationImplementation<
  typeof roomContract.updateRoom
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

    const { name, description, tableCount, isActive } = req.body;

    if (name && name !== room.name) {
      const exists = await roomRepository.getByName(name);

      if (exists) {
        return {
          status: 400,
          body: {
            success: false,
            error: "Room already exists",
          },
        };
      }
    }

    await roomRepository.update(roomID, {
      name,
      description,
      tableCount,
      isActive,
    });

    return {
      status: 200,
      body: {
        success: true,
        message: "Room updated successfully",
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

export const removeRoom: AppRouteMutationImplementation<
  typeof roomContract.removeRoom
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

    await roomRepository.delete(roomID);

    return {
      status: 200,
      body: {
        success: true,
        message: "Room deleted successfully",
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

export const roomMutationHandler = {
  createRoom,
  updateRoom,
  removeRoom,
};
