import { AppRouteMutationImplementation } from "@ts-rest/express";
import { roomContract } from "../../contract/room/room.contract";
import roomRepository from "../../repository/room.repository";
import logRepository from "../../repository/log.repository";
import mongoose from "mongoose";

export const createRoom: AppRouteMutationImplementation<
  typeof roomContract.createRoom
> = async ({ req }) => {
  try {
    console.log("[CREATE ROOM] BODY:", req.body);

    const { name, description, isActive } = req.body;

    const existingRoom = await roomRepository.getByName(name);

    console.log("[CREATE ROOM] EXISTING CHECK:", {
      name,
      exists: !!existingRoom,
    });

    if (existingRoom) {
      console.warn("[CREATE ROOM] ROOM ALREADY EXISTS:", name);

      return {
        status: 400,
        body: {
          success: false,
          error: "Room already exists",
        },
      };
    }

    console.log("[CREATE ROOM] CREATING ROOM...");

    const created = await roomRepository.create({
      name,
      description,
      isActive,
    });

    console.log("[CREATE ROOM] CREATED ROOM ID:", created?._id);

    const log = await logRepository.create({
      userId: new mongoose.Types.ObjectId(req.user?.id),
      action: "Create",
      details: `Room ${created.name} created at ${new Date().toLocaleString(
        "en-US",
        {
          timeZone: "Asia/Kathmandu",
        },
      )}`,
      module: "Room",
      entityId: `${created._id}`,
      entityType: "",
    });

    if (!log) {
      console.log("User log not created", log);
    }

    return {
      status: 201,
      body: {
        success: true,
        message: "Room created successfully",
      },
    };
  } catch (error) {
    console.error("[CREATE ROOM] ERROR:", error);
    console.error("[CREATE ROOM] BODY:", req.body);

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
    console.log("[UPDATE ROOM] PARAMS:", req.params);
    console.log("[UPDATE ROOM] BODY:", req.body);

    const { roomID } = req.params;

    const room = await roomRepository.getByID(roomID);

    console.log("[UPDATE ROOM] FOUND:", {
      roomID,
      exists: !!room,
    });

    if (!room) {
      console.warn("[UPDATE ROOM] NOT FOUND:", roomID);

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

      console.log("[UPDATE ROOM] NAME CHECK:", {
        name,
        exists: !!exists,
      });

      if (exists) {
        console.warn("[UPDATE ROOM] DUPLICATE NAME:", name);

        return {
          status: 400,
          body: {
            success: false,
            error: "Room already exists",
          },
        };
      }
    }

    console.log("[UPDATE ROOM] UPDATING...");

    await roomRepository.update(roomID, {
      name,
      description,
      isActive,
    });

    console.log("[UPDATE ROOM] UPDATED SUCCESSFULLY:", roomID);

    const log = await logRepository.create({
      userId: new mongoose.Types.ObjectId(req.user?.id),
      action: "Update",
      details: `Room ${room.name} updated at ${new Date().toLocaleString(
        "en-US",
        {
          timeZone: "Asia/Kathmandu",
        },
      )}`,
      module: "Room",
      entityId: `${roomID}`,
      entityType: "",
    });

    if (!log) {
      console.log("User log not created", log);
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Room updated successfully",
      },
    };
  } catch (error) {
    console.error("[UPDATE ROOM] ERROR:", error);
    console.error("[UPDATE ROOM] PARAMS:", req.params);
    console.error("[UPDATE ROOM] BODY:", req.body);

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
    console.log("[DELETE ROOM] PARAMS:", req.params);

    const { roomID } = req.params;

    const room = await roomRepository.getByID(roomID);

    console.log("[DELETE ROOM] FOUND:", {
      roomID,
      exists: !!room,
    });

    if (!room) {
      console.warn("[DELETE ROOM] NOT FOUND:", roomID);

      return {
        status: 404,
        body: {
          success: false,
          error: "Room not found",
        },
      };
    }

    console.log("[DELETE ROOM] DELETING...");

    const log = await logRepository.create({
      userId: new mongoose.Types.ObjectId(req.user?.id),
      action: "Delete",
      details: `Room ${room.name} deleted at ${new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kathmandu",
      })}`,
      module: "Room",
      entityId: `${roomID}`,
      entityType: "",
    });

    if (!log) {
      console.log("User log not created", log);
    }

    await roomRepository.delete(roomID);

    console.log("[DELETE ROOM] DELETED:", roomID);

    return {
      status: 200,
      body: {
        success: true,
        message: "Room deleted successfully",
      },
    };
  } catch (error) {
    console.error("[DELETE ROOM] ERROR:", error);
    console.error("[DELETE ROOM] PARAMS:", req.params);

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
