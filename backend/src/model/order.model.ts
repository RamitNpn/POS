import mongoose, { Document, Schema } from "mongoose";

export type PaymentStatus = "pending" | "paid" | "refunded";

export type PaymentMethod = "cash" | "card" | "mobile" | "split";

export interface IOrderItem {
  menuItemId: mongoose.Types.ObjectId;
  quantity: number;
  notes?: string;
  price: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  tableId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  customerName: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  subtotal: number;
  tax: number;
  discount?: number;
  serviceCharge?: number;
  total: number;
  notes?: string;
  completedAt?: Date;
  waiterId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema(
  {
    menuItemId: {
      type: Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    notes: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  {
    _id: true,
  },
);

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },

    tableId: {
      type: Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      default: [],
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "mobile", "split"],
    },

    subtotal: {
      type: Number,
      required: true,
    },

    tax: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    serviceCharge: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },

    notes: {
      type: String,
    },

    completedAt: {
      type: Date,
    },

    waiterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IOrder>("Order", orderSchema);
