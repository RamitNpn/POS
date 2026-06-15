import mongoose, { Schema, Document } from "mongoose";

export interface IMenuItem extends Document {
  name: string;
  description: string;
  price: number;
  categoryId: mongoose.Types.ObjectId;
  image?: string;
  status: "available" | "out-of-stock";
  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema = new mongoose.Schema<IMenuItem>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "MenuCategory",
      required: true,
    },
    image: String,
    status: {
      type: String,
      enum: ["available", "out-of-stock"],
      default: "available",
    },
  },
  {
    timestamps: true,
  },
);

const MenuItem = mongoose.model<IMenuItem>("MenuItem", menuItemSchema);

export default MenuItem;
