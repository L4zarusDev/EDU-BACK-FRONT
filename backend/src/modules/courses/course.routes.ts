import { Router } from "express";

import * as controller from "./course.controller";



import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { uploadCourseThumbnail } from "../../middlewares/upload.middleware";

import { Role } from "@prisma/client";

const router = Router();

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

router.get(
  "/admin/all",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.getAllAdmin
);

router.post(
  "/",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.create
);

router.patch(
  "/:id",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.update
);

router.patch(
  "/:id/publish",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.publish
);

router.patch(
  "/:id/unpublish",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.unpublish
);

router.patch(
  "/:id/premium",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.premium
);

router.patch(
  "/:id/free",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.free
);

router.post(
  "/:id/thumbnail",
  authMiddleware,
  requireRole(Role.ADMIN),
  uploadCourseThumbnail.single("file"),
  controller.uploadThumbnail
);

router.patch(
  "/:id/thumbnail",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.thumbnail
);

router.patch(
  "/:id/restore",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.restore
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.remove
);

/*
|--------------------------------------------------------------------------
| Debe ir al final
|--------------------------------------------------------------------------
*/

router.get("/:id", controller.getOne);

export default router;