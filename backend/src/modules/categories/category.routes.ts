import { Router } from "express";
import * as controller from "./category.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

import { Role } from "@prisma/client";

const router = Router();

/* Públicas */

router.get("/", controller.getAll);



/* Administrador */

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

router.delete(
  "/:id",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.remove
);

router.patch(
  "/:id/restore",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.restore
);

router.get("/:id", controller.getOne);

export default router;