import mongoose, { Document, Schema } from "mongoose";

export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  details: string;

  module?: string;
  entityId?: string;
  entityType?: string;

  createdAt: Date;
  updatedAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    details: {
      type: String,
      required: true,
    },

    module: {
      type: String,
      default: "",
    },

    entityId: {
      type: String,
      default: "",
    },

    entityType: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const ActivityLogModel = mongoose.model<IActivityLog>(
  "ActivityLog",
  activityLogSchema
);

export default ActivityLogModel;