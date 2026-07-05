import multer from "multer";
import path from "path";
import fs from "fs";

function createUploadMiddleware(destination: string, allowedMimeTypes: string[], maxSize = 25 * 1024 * 1024) {
  const uploadDir = path.resolve(destination);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, uploadDir);
    },
    filename(req, file, cb) {
      const unique = `${Date.now()}-${Math.round(Math.random() * 100000)}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    },
  });

  return multer({
    storage,
    limits: {
      fileSize: maxSize,
    },
    fileFilter(req, file, cb) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error("Tipo de archivo no permitido"));
      }

      cb(null, true);
    },
  });
}

export const uploadReceipt = createUploadMiddleware("uploads/receipts", [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
]);

export const uploadCourseThumbnail = createUploadMiddleware("uploads/course-thumbnails", [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

export const uploadLessonMedia = createUploadMiddleware("uploads/lesson-media", [
  "application/pdf",
  "video/mp4",
  "video/webm",
  "video/ogg",
], 50 * 1024 * 1024);