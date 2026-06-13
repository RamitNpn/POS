import mongoose, { Document } from "mongoose";

export interface IRoom extends Document {
  name: string;
  description?: string;
  tableCount: number;
  isActive: boolean;
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

    tableCount: {
      type: Number,
      required: true,
      default: 0,
    },

    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const RoomModel = mongoose.model<IRoom>("Room", roomSchema);

export default RoomModel;
