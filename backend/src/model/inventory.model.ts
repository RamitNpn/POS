import mongoose, { Document, Schema } from "mongoose";

export interface IInventory extends Document {
  sku: string;
  name: string;
  unit: string;

  currentStock: number;
  minimumStock: number;
  reorderLevel: number;

  costPerUnit: number;

  supplierId?: mongoose.Types.ObjectId;

  expiryDate?: Date;
  lastRestocked?: Date;

  category: string;
}

const inventorySchema = new Schema<IInventory>(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    unit: {
      type: String,
      required: true,
    },

    currentStock: {
      type: Number,
      required: true,
      default: 0,
    },

    minimumStock: {
      type: Number,
      required: true,
      default: 0,
    },

    reorderLevel: {
      type: Number,
      required: true,
      default: 0,
    },

    costPerUnit: {
      type: Number,
      required: true,
    },

    supplierId: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
    },

    expiryDate: {
      type: Date,
    },

    lastRestocked: {
      type: Date,
    },

    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IInventory>(
  "Inventory",
  inventorySchema,
);