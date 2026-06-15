import mongoose, { Document, Schema } from "mongoose";

export interface ITable extends Document {
  name: string;
  capacity: number;
  status: "available" | "occupied" | "reserved" | "cleaning" | "out-of-service";

  sectionId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const tableSchema = new mongoose.Schema<ITable>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    capacity: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: ["available", "occupied", "reserved", "cleaning", "out-of-service"],
      default: "available",
    },

    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const TableModel = mongoose.model<ITable>("Table", tableSchema);

export default TableModel;
