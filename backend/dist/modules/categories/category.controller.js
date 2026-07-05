"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getAllAdmin = getAllAdmin;
exports.getOne = getOne;
exports.create = create;
exports.update = update;
exports.remove = remove;
exports.restore = restore;
const zod_1 = require("zod");
const category_service_1 = require("./category.service");
const category_validation_1 = require("./category.validation");
async function getAll(req, res) {
    try {
        const categories = await (0, category_service_1.getAllCategories)();
        return res.json({
            success: true,
            data: categories,
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
        const categories = await (0, category_service_1.getAllCategoriesAdmin)();
        return res.json({
            success: true,
            data: categories,
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
        const category = await (0, category_service_1.getCategory)(req.params.id);
        return res.json({
            success: true,
            data: category,
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
        const body = category_validation_1.createCategorySchema.parse(req.body);
        const category = await (0, category_service_1.createCategory)(body);
        return res.status(201).json({
            success: true,
            message: "Categoría creada correctamente.",
            data: category,
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
        const body = category_validation_1.updateCategorySchema.parse(req.body);
        const category = await (0, category_service_1.updateCategory)(req.params.id, body);
        return res.json({
            success: true,
            message: "Categoría actualizada correctamente.",
            data: category,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: buildErrorMessage(error),
        });
    }
}
async function remove(req, res) {
    try {
        const category = await (0, category_service_1.deleteCategory)(req.params.id);
        return res.json({
            success: true,
            message: "Categoría desactivada correctamente.",
            data: category,
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
        const category = await (0, category_service_1.restoreCategory)(req.params.id);
        return res.json({
            success: true,
            message: "Categoría restaurada correctamente.",
            data: category,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}
