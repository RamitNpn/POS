import mongoose, { Document } from "mongoose";

export type UserRole = "admin" | "waiter" | "kitchen" | "cashier";

export type UserStatus = "active" | "inactive" | "suspended";

export interface IUser extends Document {
  name: string;
  email: string;
  role: UserRole;
  profile?: string;
  phone: string;
  password: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["admin", "waiter", "kitchen", "cashier"],
      required: true,
    },

    profile: {
      type: String,
      default: null,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
      required: true,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;