import { Router } from "express";

import * as controller from "./payment.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

import { uploadReceipt } from "../../middlewares/upload.middleware";

import { Role } from "@prisma/client";

const router = Router();

/*
|--------------------------------------------------------------------------
| Alumno
|--------------------------------------------------------------------------
*/

// Crear pago
router.post(
  "/",
  authMiddleware,
  requireRole(Role.STUDENT),
  uploadReceipt.single("receipt"),
  controller.create
);

// Mis pagos
router.get(
  "/me",
  authMiddleware,
  requireRole(Role.STUDENT),
  controller.myPayments
);

/*
|--------------------------------------------------------------------------
| Administrador
|--------------------------------------------------------------------------
*/

// Todos los pagos
router.get(
  "/",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.all
);

// Pendientes
router.get(
  "/pending",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.pending
);

// Un pago
router.get(
  "/:id",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.getOne
);

// Aprobar
router.patch(
  "/:id/approve",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.approve
);

// Rechazar
router.patch(
  "/:id/reject",
  authMiddleware,
  requireRole(Role.ADMIN),
  controller.reject
);

export default router;