import mongoose, { Document, Schema } from "mongoose";

export interface IMenuCategory extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const menuCategorySchema = new mongoose.Schema<IMenuCategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const MenuCategory = mongoose.model<IMenuCategory>(
  "MenuCategory",
  menuCategorySchema,
);

export default MenuCategory;
