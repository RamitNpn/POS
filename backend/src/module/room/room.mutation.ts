import { AppRouteMutationImplementation } from "@ts-rest/express";
import { roomContract } from "../../contract/room/room.contract";
import roomRepository from "../../repository/room.repository";
import { getIO } from "../../utils/socket";

export const createRoom: AppRouteMutationImplementation<
  typeof roomContract.createRoom
> = async ({ req }) => {
  try {
    const { name, description, isActive } = req.body;

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

    const data = await roomRepository.create({
      name,
      description,
      isActive,
    });

    try {
      const io = getIO();
      io.emit("room:updated", data);
    } catch (err) {
      console.error("Socket emit error in createRoom:", err);
    }

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

    const { name, description, isActive } = req.body;

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

    const updated = await roomRepository.update(roomID, {
      name,
      description,
      isActive,
    });

    try {
      const io = getIO();
      io.emit("room:updated", updated);
    } catch (err) {
      console.error("Socket emit error in updateRoom:", err);
    }

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

    try {
      const io = getIO();
      io.emit("room:updated", { _id: roomID, action: "delete" });
    } catch (err) {
      console.error("Socket emit error in removeRoom:", err);
    }

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
