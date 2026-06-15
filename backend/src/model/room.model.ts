import mongoose, { Document } from "mongoose";

export type Status = "active" | "inactive";
export interface IRoom extends Document {
  name: string;
  description?: string;
  isActive: Status;
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new mongoose.Schema<IRoom>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    isActive: {
      type: String,
      enum: ["active", "inactive"],
      required: true,
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

const RoomModel = mongoose.model<IRoom>("Room", roomSchema);

export default RoomModel;
