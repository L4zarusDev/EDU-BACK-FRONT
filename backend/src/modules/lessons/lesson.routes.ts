import { Router } from "express";

import * as controller from "./lesson.controller";
import * as progressController from "./lessonProgress.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { canAccessLesson } from "../../middlewares/canAccessLesson.middleware";
import { uploadLessonMedia } from "../../middlewares/upload.middleware";

import { Role } from "@prisma/client";

const router = Router();

/*
|--------------------------------------------------------------------------
| Públicas
|--------------------------------------------------------------------------
*/

// Obtener las lecciones de un curso
router.get(
  "/course/:courseId",
  controller.getAll
);

// Admin: todas las lecciones
router.get(
  "/admin/all",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.getAllAdmin
);

// Obtener una lección
router.get(
  "/:id",
  controller.getOne
);

/*
|--------------------------------------------------------------------------
| Administrador
|--------------------------------------------------------------------------
*/

// Crear lección
router.post(
  "/course/:courseId",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.create
);

// Actualizar
router.patch(
  "/:id",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.update
);

router.post(
  "/:id/media",
  authMiddleware,
  requireRole(Role.ADMIN),
  uploadLessonMedia.single("file"),
  controller.uploadMedia
);

// Publicar
router.patch(
  "/:id/publish",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.publish
);

// Ocultar
router.patch(
  "/:id/unpublish",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.unpublish
);

// Marcar como vista previa
router.patch(
  "/:id/preview",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.preview
);

// Quitar vista previa
router.patch(
  "/:id/no-preview",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.removePreview
);

// Eliminar
router.delete(
  "/:id",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.remove
);

router.get(
  "/:id/view",
  authMiddleware,
  canAccessLesson,
  controller.view
);

// Progreso
router.post(
  "/:lessonId/complete",
  authMiddleware,
  progressController.completeLesson
);

router.get(
  "/course/:courseId/progress",
  authMiddleware,
  progressController.getCourseProgress
);

export default router;