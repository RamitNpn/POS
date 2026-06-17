"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const roomSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
    },
    isActive: {
        type: String,
        enum: ["active", "inactive"],
        required: true,
        default: "active",
    },
}, {
    timestamps: true,
});
const RoomModel = mongoose_1.default.model("Room", roomSchema);
exports.default = RoomModel;
