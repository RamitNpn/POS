import mongoose, { Schema, Document } from "mongoose";

export interface IMenuItem extends Document {
  name: string;
  description: string;
  price: number;
  categoryId: mongoose.Types.ObjectId;
  subCategoryId: mongoose.Types.ObjectId;
  image?: string;
  status: "available" | "out-of-stock" | "hidden";
  costPrice?: number;
  variantType?: "ml" | "veg" | "non-veg" | "chili" | "fry" | "boil";
  variantValue?: string;
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
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "MenuSubCategory",
      required: true,
    },
    image: String,
    status: {
      type: String,
      enum: ["available", "out-of-stock", "hidden"],
      default: "available",
    },
    costPrice: Number,
    variantType: {
      type: String,
      enum: ["ml", "veg", "non-veg", "chili", "fry", "boil"],
    },
    variantValue: String,
  },
  {
    timestamps: true,
  },
);

const MenuItem = mongoose.model<IMenuItem>("MenuItem", menuItemSchema);

export default MenuItem;
