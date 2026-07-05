"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageBufferToCloudinary = uploadImageBufferToCloudinary;
const cloudinary_1 = require("cloudinary");
function getRequiredEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Falta configurar la variable ${name}`);
    }
    return value;
}
let configured = false;
function ensureCloudinaryConfigured() {
    if (configured)
        return;
    cloudinary_1.v2.config({
        cloud_name: getRequiredEnv("CLOUDINARY_CLOUD_NAME"),
        api_key: getRequiredEnv("CLOUDINARY_API_KEY"),
        api_secret: getRequiredEnv("CLOUDINARY_API_SECRET"),
        secure: true,
    });
    configured = true;
}
async function uploadImageBufferToCloudinary(buffer, mimeType, folder) {
    ensureCloudinaryConfigured();
    const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
    const uploadResult = await cloudinary_1.v2.uploader.upload(dataUri, {
        folder,
        resource_type: "image",
    });
    return {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
    };
}
