import { Router } from "express";

import * as controller from "./membership.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

import { Role } from "@prisma/client";

const router = Router();

/*
|--------------------------------------------------------------------------
| Alumno
|--------------------------------------------------------------------------
*/

router.get(
  "/me",
  authMiddleware,
  controller.me
);

/*
|--------------------------------------------------------------------------
| Administrador
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.all
);

router.get(
  "/:userId",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.getOne
);

export default router;