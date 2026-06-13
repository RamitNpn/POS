import mongoose, { Document, Schema } from "mongoose";

export interface IMenuSubCategory extends Document {
  name: string;
  description?: string;
  categoryId: mongoose.Types.ObjectId;
  categoryName: string;
  itemCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const menuSubCategorySchema = new mongoose.Schema<IMenuSubCategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuCategory",
      required: true,
    },

    categoryName: {
      type: String,
      required: true,
      trim: true,
    },

    itemCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const MenuSubCategory = mongoose.model<IMenuSubCategory>(
  "MenuSubCategory",
  menuSubCategorySchema,
);

export default MenuSubCategory;
