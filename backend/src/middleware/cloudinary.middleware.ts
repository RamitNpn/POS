import { upload } from "./multer.middleware";

export const userUploadFields = upload.fields([
  { name: "profile", maxCount: 1 },
  { name: "image", maxCount: 1},
]);