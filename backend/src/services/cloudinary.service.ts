import { v2 as cloudinary } from "cloudinary";

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Falta configurar la variable ${name}`);
  }

  return value;
}

let configured = false;

function ensureCloudinaryConfigured() {
  if (configured) return;

  cloudinary.config({
    cloud_name: getRequiredEnv("CLOUDINARY_CLOUD_NAME"),
    api_key: getRequiredEnv("CLOUDINARY_API_KEY"),
    api_secret: getRequiredEnv("CLOUDINARY_API_SECRET"),
    secure: true,
  });

  configured = true;
}

export async function uploadImageBufferToCloudinary(
  buffer: Buffer,
  mimeType: string,
  folder: string
) {
  ensureCloudinaryConfigured();

  const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;

  const uploadResult = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
  });

  return {
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
  };
}
