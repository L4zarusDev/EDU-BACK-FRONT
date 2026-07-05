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
const controller = __importStar(require("./course.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const upload_middleware_1 = require("../../middlewares/upload.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
/*
|--------------------------------------------------------------------------
| Públicas
|--------------------------------------------------------------------------
*/
router.get("/", controller.getAll);
router.get("/premium", controller.premiumCourses);
router.get("/free", controller.freeCourses);
router.get("/slug/:slug", controller.getBySlug);
/*
|--------------------------------------------------------------------------
| Administrador
|--------------------------------------------------------------------------
*/
router.get("/admin/all", auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(client_1.Role.ADMIN), controller.getAllAdmin);
router.post("/", auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(client_1.Role.ADMIN), controller.create);
router.patch("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(client_1.Role.ADMIN), controller.update);
router.patch("/:id/publish", auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(client_1.Role.ADMIN), controller.publish);
router.patch("/:id/unpublish", auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(client_1.Role.ADMIN), controller.unpublish);
router.patch("/:id/premium", auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(client_1.Role.ADMIN), controller.premium);
router.patch("/:id/free", auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(client_1.Role.ADMIN), controller.free);
router.post("/:id/thumbnail", auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(client_1.Role.ADMIN), upload_middleware_1.uploadCourseThumbnail.single("file"), controller.uploadThumbnail);
router.patch("/:id/thumbnail", auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(client_1.Role.ADMIN), controller.thumbnail);
router.patch("/:id/restore", auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(client_1.Role.ADMIN), controller.restore);
router.delete("/:id", auth_middleware_1.authMiddleware, (0, role_middleware_1.requireRole)(client_1.Role.ADMIN), controller.remove);
/*
|--------------------------------------------------------------------------
| Debe ir al final
|--------------------------------------------------------------------------
*/
router.get("/:id", controller.getOne);
exports.default = router;
