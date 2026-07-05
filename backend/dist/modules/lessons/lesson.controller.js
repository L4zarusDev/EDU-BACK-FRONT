"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getAllAdmin = getAllAdmin;
exports.getOne = getOne;
exports.view = view;
exports.create = create;
exports.update = update;
exports.publish = publish;
exports.unpublish = unpublish;
exports.preview = preview;
exports.removePreview = removePreview;
exports.remove = remove;
exports.uploadMedia = uploadMedia;
const path_1 = __importDefault(require("path"));
const lesson_service_1 = require("./lesson.service");
const lesson_validation_1 = require("./lesson.validation");
function getYouTubeVideoId(url) {
    try {
        const parsed = new URL(url);
        const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
        if (host === "youtube.com" || host === "m.youtube.com") {
            const fromQuery = parsed.searchParams.get("v");
            if (fromQuery)
                return fromQuery;
            if (parsed.pathname.startsWith("/shorts/")) {
                return parsed.pathname.split("/shorts/")[1]?.split("/")[0] ?? null;
            }
        }
        if (host === "youtu.be") {
            return parsed.pathname.replace(/^\//, "").split("/")[0] ?? null;
        }
        return null;
    }
    catch {
        return null;
    }
}
function normalizeLessonLinks(data) {
    const next = { ...data };
    if (typeof next.videoUrl === "string" && next.videoUrl.trim()) {
        const trimmed = next.videoUrl.trim();
        const youtubeId = getYouTubeVideoId(trimmed);
        if (youtubeId) {
            next.videoUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}`;
        }
        else {
            next.videoUrl = trimmed;
        }
    }
    if (typeof next.pdfUrl === "string" && next.pdfUrl.trim()) {
        next.pdfUrl = next.pdfUrl.trim();
    }
    return next;
}
function buildPublicUrl(req, fileName) {
    const relativePath = path_1.default.relative(path_1.default.resolve("uploads"), path_1.default.resolve("uploads", fileName)).replace(/\\/g, "/");
    return `${req.protocol}://${req.get("host")}/uploads/${relativePath}`;
}
async function getAll(req, res) {
    try {
        const lessons = await (0, lesson_service_1.getLessons)(req.params.courseId);
        return res.json({ success: true, data: lessons });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}
async function getAllAdmin(req, res) {
    try {
        const lessons = await (0, lesson_service_1.getAllLessonsAdmin)();
        return res.json({ success: true, data: lessons });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
async function getOne(req, res) {
    try {
        const lesson = await (0, lesson_service_1.getLessonInfo)(req.params.id);
        return res.json({
            success: true,
            data: lesson,
        });
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
}
async function view(req, res) {
    try {
        const lesson = await (0, lesson_service_1.getLessonContent)(req.params.id);
        return res.json({
            success: true,
            data: lesson,
        });
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
}
async function create(req, res) {
    try {
        const body = normalizeLessonLinks(lesson_validation_1.createLessonSchema.parse(req.body));
        const lesson = await (0, lesson_service_1.createLesson)(req.params.courseId, body);
        return res.status(201).json({
            success: true,
            message: "Lección creada correctamente.",
            data: lesson,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}
async function update(req, res) {
    try {
        const body = normalizeLessonLinks(lesson_validation_1.updateLessonSchema.parse(req.body));
        const lesson = await (0, lesson_service_1.updateLesson)(req.params.id, body);
        return res.json({
            success: true,
            message: "Lección actualizada.",
            data: lesson,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}
async function publish(req, res) {
    try {
        const lesson = await (0, lesson_service_1.publishLesson)(req.params.id);
        return res.json({
            success: true,
            message: "Lección publicada.",
            data: lesson,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}
async function unpublish(req, res) {
    try {
        const lesson = await (0, lesson_service_1.unpublishLesson)(req.params.id);
        return res.json({
            success: true,
            message: "Lección ocultada.",
            data: lesson,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}
async function preview(req, res) {
    try {
        const lesson = await (0, lesson_service_1.enablePreview)(req.params.id);
        return res.json({
            success: true,
            message: "Vista previa activada.",
            data: lesson,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}
async function removePreview(req, res) {
    try {
        const lesson = await (0, lesson_service_1.disablePreview)(req.params.id);
        return res.json({
            success: true,
            message: "Vista previa desactivada.",
            data: lesson,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}
async function remove(req, res) {
    try {
        await (0, lesson_service_1.deleteLesson)(req.params.id);
        return res.json({
            success: true,
            message: "Lección eliminada.",
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}
async function uploadMedia(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No se recibió ningún archivo.",
            });
        }
        const isVideo = req.file.mimetype.startsWith("video/");
        const mediaUrl = buildPublicUrl(req, req.file.path.replace(path_1.default.resolve("uploads"), "").replace(/^\\/, ""));
        const lesson = await (0, lesson_service_1.updateLesson)(req.params.id, {
            [isVideo ? "videoUrl" : "pdfUrl"]: mediaUrl,
        });
        return res.json({
            success: true,
            message: "Material actualizado.",
            data: lesson,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}
