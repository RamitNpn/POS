"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ["admin", "waiter", "kitchen", "cashier"],
        required: true,
    },
    profile: {
        type: String,
        default: null,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    status: {
        type: String,
        enum: ["active", "inactive", "suspended"],
        default: "active",
        required: true,
    }
}, {
    timestamps: true,
    versionKey: false,
});
const UserModel = mongoose_1.default.model("User", userSchema);
exports.default = UserModel;
