import mongoose, { Document, Schema } from "mongoose";

export interface IBranch extends Document {
  name: string;
  address: string;
  phone: string;
  managerName?: string;
  status: "active" | "inactive";
  opened: string;
  createdAt: Date;
  updatedAt: Date;
}

const BranchSchema = new Schema<IBranch>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    managerName: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    opened: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IBranch>("Branch", BranchSchema);
