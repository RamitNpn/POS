import mongoose, { Document } from "mongoose";

export type Status = "active" | "inactive";
export interface IRole extends Document {
  name: string;
  description?: string;
  isActive: Status;
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new mongoose.Schema<IRole>(
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

const RoleModel = mongoose.model<IRole>("Role", roleSchema);

export default RoleModel;
