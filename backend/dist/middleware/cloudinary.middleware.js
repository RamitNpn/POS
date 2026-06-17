"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUploadFields = void 0;
const multer_middleware_1 = require("./multer.middleware");
exports.userUploadFields = multer_middleware_1.upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "image", maxCount: 1 },
]);
