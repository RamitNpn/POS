import mongoose, { Schema, Document } from "mongoose";

export interface IDailyReport extends Document {
  reportDate: Date;

  totalRevenue: number;
  totalOrders: number;

  cashSales: number;
  onlineSales: number;

  totalDiscount: number;
  totalTax: number;

  generatedAt: Date;
}

const DailyReportSchema = new mongoose.Schema<IDailyReport>(
  {
    reportDate: {
      type: Date,
      required: true,
      unique: true,
      index: true,
    },

    totalRevenue: {
      type: Number,
      required: true,
      default: 0,
    },

    totalOrders: {
      type: Number,
      required: true,
      default: 0,
    },

    cashSales: {
      type: Number,
      default: 0,
    },

    onlineSales: {
      type: Number,
      default: 0,
    },

    totalDiscount: {
      type: Number,
      default: 0,
    },

    totalTax: {
      type: Number,
      default: 0,
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const DailyReportModel = mongoose.model<IDailyReport>(
  "DailyReport",
  DailyReportSchema,
);

export default DailyReportModel;
