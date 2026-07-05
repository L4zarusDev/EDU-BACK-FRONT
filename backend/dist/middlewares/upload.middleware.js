"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadLessonMedia = exports.uploadCourseThumbnail = exports.uploadReceipt = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function buildFileFilter(allowedMimeTypes) {
    return (_req, file, cb) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error("Tipo de archivo no permitido"));
        }
        cb(null, true);
    };
}
function createUploadMiddleware(destination, allowedMimeTypes, maxSize = 25 * 1024 * 1024) {
    const uploadDir = path_1.default.resolve(destination);
    if (!fs_1.default.existsSync(uploadDir)) {
        fs_1.default.mkdirSync(uploadDir, { recursive: true });
    }
    const storage = multer_1.default.diskStorage({
        destination(req, file, cb) {
            cb(null, uploadDir);
        },
        filename(req, file, cb) {
            const unique = `${Date.now()}-${Math.round(Math.random() * 100000)}`;
            cb(null, `${unique}${path_1.default.extname(file.originalname)}`);
        },
    });
    return (0, multer_1.default)({
        storage,
        limits: {
            fileSize: maxSize,
        },
        fileFilter: buildFileFilter(allowedMimeTypes),
    });
}
function createMemoryUploadMiddleware(allowedMimeTypes, maxSize = 25 * 1024 * 1024) {
    return (0, multer_1.default)({
        storage: multer_1.default.memoryStorage(),
        limits: {
            fileSize: maxSize,
        },
        fileFilter: buildFileFilter(allowedMimeTypes),
    });
}
exports.uploadReceipt = createMemoryUploadMiddleware([
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/gif",
]);
exports.uploadCourseThumbnail = createUploadMiddleware("uploads/course-thumbnails", [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
]);
exports.uploadLessonMedia = createUploadMiddleware("uploads/lesson-media", [
    "application/pdf",
    "video/mp4",
    "video/webm",
    "video/ogg",
], 50 * 1024 * 1024);
