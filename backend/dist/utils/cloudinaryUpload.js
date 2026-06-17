"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
const fs_1 = __importDefault(require("fs"));
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config"));
const uploadToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary_config_1.default.uploader.upload(filePath, {
            folder: "restaurant-pos",
            resource_type: "image",
        });
        fs_1.default.unlinkSync(filePath);
        return result.secure_url;
    }
    catch (error) {
        throw new Error("Cloudinary upload failed");
    }
};
exports.uploadToCloudinary = uploadToCloudinary;
