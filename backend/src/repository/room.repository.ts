import mongoose from "mongoose";
import Room, { IRoom } from "../model/room.model";
import RoomModel from "../model/room.model";

class RoomRepository {
  private model;

  constructor() {
    this.model = RoomModel;
  }

  async create(data: Partial<IRoom>) {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating user: ${error}`);
    }
  }

  async getAll({
    skip = 0,
    limit = 10,
    search,
  }: {
    skip?: number;
    limit?: number;
    search?: string;
  }) {
    const query: any = {};

    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    const data = await this.model
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await this.model.countDocuments(query);

    return {
      data,
      total,
    };
  }

  async getByID(roomID: string) {
    if (!mongoose.Types.ObjectId.isValid(roomID)) {
      return null;
    }

    return await Room.findById(roomID);
  }

  async getByName(name: string) {
    return await Room.findOne({
      name: {
        $regex: `^${name}$`,
        $options: "i",
      },
    });
  }

  async update(roomID: string, payload: Partial<IRoom>) {
    if (!mongoose.Types.ObjectId.isValid(roomID)) {
      return null;
    }

    return await Room.findByIdAndUpdate(roomID, payload, {
      new: true,
      runValidators: true,
    });
  }

  async delete(roomID: string) {
    if (!mongoose.Types.ObjectId.isValid(roomID)) {
      return null;
    }

    return await Room.findByIdAndDelete(roomID);
  }
}

export default new RoomRepository();
