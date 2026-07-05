import { Router } from "express";

import { dashboard } from "./dashboard.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { requireRole } from "../../middlewares/role.middleware";

import { Role } from "@prisma/client";

const router=Router();

router.get(

    "/",

    authMiddleware,

    requireRole(Role.ADMIN),

    dashboard

);

export default router;