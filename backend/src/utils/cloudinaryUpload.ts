import fs from "fs";
import cloudinary from "../config/cloudinary.config";

export const uploadToCloudinary = async (filePath: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "flowdesk-users",
      resource_type: "image",
    });

    fs.unlinkSync(filePath);

    return result.secure_url;
  } catch (error) {
    throw new Error("Cloudinary upload failed");
  }
};