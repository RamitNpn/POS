"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tableSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["available", "occupied", "reserved", "cleaning", "out-of-service"],
        default: "available",
    },
    sectionId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    },
}, {
    timestamps: true,
});
const TableModel = mongoose_1.default.model("Table", tableSchema);
exports.default = TableModel;
