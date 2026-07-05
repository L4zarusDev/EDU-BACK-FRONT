"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getAllAdmin = getAllAdmin;
exports.getOne = getOne;
exports.getBySlug = getBySlug;
exports.create = create;
exports.update = update;
exports.publish = publish;
exports.unpublish = unpublish;
exports.premium = premium;
exports.free = free;
exports.remove = remove;
exports.restore = restore;
exports.thumbnail = thumbnail;
exports.uploadThumbnail = uploadThumbnail;
exports.premiumCourses = premiumCourses;
exports.freeCourses = freeCourses;
const path_1 = __importDefault(require("path"));
const zod_1 = require("zod");
const course_service_1 = require("./course.service");
const course_validation_1 = require("./course.validation");
function buildPublicUrl(req, fileName) {
    const relativePath = path_1.default.relative(path_1.default.resolve("uploads"), path_1.default.resolve("uploads", fileName)).replace(/\\/g, "/");
    return `${req.protocol}://${req.get("host")}/uploads/${relativePath}`;
}
async function getAll(req, res) {
    try {
        const courses = await (0, course_service_1.getCourses)();
        return res.json({
            success: true,
            data: courses,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
async function getAllAdmin(req, res) {
    try {
        const courses = await (0, course_service_1.getCoursesAdmin)();
        return res.json({
            success: true,
            data: courses,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
async function getOne(req, res) {
    try {
        const course = await (0, course_service_1.getCourse)(req.params.id);
        return res.json({
            success: true,
            data: course,
        });
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
}
async function getBySlug(req, res) {
    try {
        const course = await (0, course_service_1.getCourseBySlug)(req.params.slug);
        return res.json({
            success: true,
            data: course,
        });
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
}
function buildErrorMessage(error) {
    if (error instanceof zod_1.ZodError) {
        return error.errors
            .map((issue) => `${issue.path.join('.') || 'input'}: ${issue.message}`)
            .join(', ');
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'Error en la solicitud.';
}
async function create(req, res) {
    try {
        const body = course_validation_1.createCourseSchema.parse(req.body);
        const user = req.user;
        const course = await (0, course_service_1.createCourse)(user.userId, body);
        return res.status(201).json({
            success: true,
            message: "Curso creado correctamente.",
            data: course,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: buildErrorMessage(error),
        });
    }
}
async function update(req, res) {
    try {
        const body = course_validation_1.updateCourseSchema.parse(req.body);
        const course = await (0, course_service_1.updateCourse)(req.params.id, body);
        return res.json({
            success: true,
            message: "Curso actualizado correctamente.",
            data: course,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: buildErrorMessage(error),
        });
    }
}
async function publish(req, res) {
    try {
        const course = await (0, course_service_1.publishCourse)(req.params.id);
        return res.json({
            success: true,
            message: "Curso publicado.",
            data: course,
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
        const course = await (0, course_service_1.unpublishCourse)(req.params.id);
        return res.json({
            success: true,
            message: "Curso ocultado.",
            data: course,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}
async function premium(req, res) {
    try {
        const course = await (0, course_service_1.makePremium)(req.params.id);
        return res.json({
            success: true,
            message: "Curso convertido en premium.",
            data: course,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}
async function free(req, res) {
    try {
        const course = await (0, course_service_1.makeFree)(req.params.id);
        return res.json({
            success: true,
            message: "Curso convertido en gratuito.",
            data: course,
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
        const course = await (0, course_service_1.deleteCourse)(req.params.id);
        return res.json({
            success: true,
            message: "Curso eliminado.",
            data: course,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}
async function restore(req, res) {
    try {
        const course = await (0, course_service_1.restoreCourse)(req.params.id);
        return res.json({
            success: true,
            message: "Curso restaurado.",
            data: course,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}
async function thumbnail(req, res) {
    try {
        const { thumbnail } = req.body;
        const course = await (0, course_service_1.updateThumbnail)(req.params.id, thumbnail);
        return res.json({
            success: true,
            message: "Miniatura actualizada.",
            data: course,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}
async function uploadThumbnail(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No se recibió ningún archivo.",
            });
        }
        const thumbnail = buildPublicUrl(req, req.file.path.replace(path_1.default.resolve("uploads"), "").replace(/^\\/, ""));
        const course = await (0, course_service_1.updateThumbnail)(req.params.id, thumbnail);
        return res.json({
            success: true,
            message: "Miniatura actualizada.",
            data: course,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}
async function premiumCourses(req, res) {
    const data = await (0, course_service_1.getPremiumCourses)();
    return res.json({
        success: true,
        data,
    });
}
async function freeCourses(req, res) {
    const data = await (0, course_service_1.getFreeCourses)();
    return res.json({
        success: true,
        data,
    });
}
