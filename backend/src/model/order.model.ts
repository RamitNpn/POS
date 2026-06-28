import mongoose, { Schema, Document } from "mongoose";

export type OrderStatus = "active" | "completed" | "cancelled";

export interface IOrderItem {
  menuItemId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  tableId: mongoose.Types.ObjectId;
  customerName: string;
  waiterId: mongoose.Types.ObjectId;
  notes?: string;
  items: IOrderItem[];
  orderType: "dine-in" | "takeaway";
  subtotal: number;
  tax: number;
  discount: number; // NEW
  total: number;

  paymentMethod: "cash" | "online" | "credit"; // NEW
  ticketCount: number;
  status: OrderStatus;
  paymentStatus: "pending" | "paid" | "partial";
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    menuItemId: {
      type: Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    total: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const OrderSchema = new Schema<IOrder>(
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

    customerName: {
      type: String,
      default: "Guest",
    },

    waiterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    notes: {
      type: String,
      default: "",
    },

    items: {
      type: [OrderItemSchema],
      default: [],
    },

    orderType: {
      type: String,
      enum: ["dine-in", "takeaway"],
      default: "dine-in",
    },

    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },

    tax: {
      type: Number,
      required: true,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      default: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "online", "credit"],
      default: "cash",
    },

    ticketCount: {
      type: Number,
      default: 1,
    },

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "partial"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);

export default OrderModel;
