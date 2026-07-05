"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller = __importStar(require("./lesson.controller"));
const progressController = __importStar(require("./lessonProgress.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const canAccessLesson_middleware_1 = require("../../middlewares/canAccessLesson.middleware");
const upload_middleware_1 = require("../../middlewares/upload.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
/*
|--------------------------------------------------------------------------
| Públicas
|--------------------------------------------------------------------------
*/
// Obtener las lecciones de un curso
router.get("/course/:courseId", controller.getAll);
// Admin: todas las lecciones
router.get("/admin/all", auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(client_1.Role.ADMIN), controller.getAllAdmin);
// Obtener una lección
router.get("/:id", controller.getOne);
/*
|--------------------------------------------------------------------------
| Administrador
|--------------------------------------------------------------------------
*/
// Crear lección
router.post("/course/:courseId", auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(client_1.Role.ADMIN), controller.create);
// Actualizar
router.patch("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(client_1.Role.ADMIN), controller.update);
router.post("/:id/media", auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(client_1.Role.ADMIN), upload_middleware_1.uploadLessonMedia.single("file"), controller.uploadMedia);
// Publicar
router.patch("/:id/publish", auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(client_1.Role.ADMIN), controller.publish);
// Ocultar
router.patch("/:id/unpublish", auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(client_1.Role.ADMIN), controller.unpublish);
// Marcar como vista previa
router.patch("/:id/preview", auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(client_1.Role.ADMIN), controller.preview);
// Quitar vista previa
router.patch("/:id/no-preview", auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(client_1.Role.ADMIN), controller.removePreview);
// Eliminar
router.delete("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(client_1.Role.ADMIN), controller.remove);
router.get("/:id/view", auth_middleware_1.authMiddleware, canAccessLesson_middleware_1.canAccessLesson, controller.view);
// Progreso
router.post("/:lessonId/complete", auth_middleware_1.authMiddleware, progressController.completeLesson);
router.get("/course/:courseId/progress", auth_middleware_1.authMiddleware, progressController.getCourseProgress);
exports.default = router;
