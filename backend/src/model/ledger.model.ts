import mongoose, { Schema } from "mongoose";

export interface ICreditLedger extends Document {
  voucherNo: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: Date;
  type: "debit" | "credit";
  amount: number;
  description?: string;
  reference?: string;
  remarks?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CreditLedgerSchema = new Schema(
  {
    voucherNo: {
      type: String,
      trim: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    customerPhone: {
      type: String,
      required: true,
    },

    customerEmail: {
      type: String,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    type: {
      type: String,
      enum: ["debit", "credit"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      trim: true,
    },

    reference: {
      type: String,
      trim: true,
    },

    remarks: {
      type: String,
      trim: true,
    },

    paymentMethod: {
      type: String,
      trim: true,
    },

    createdBy: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);


const CreditLedgerModel = mongoose.model<ICreditLedger>(
  "CreditLedger",
  CreditLedgerSchema,
);

export default CreditLedgerModel;
