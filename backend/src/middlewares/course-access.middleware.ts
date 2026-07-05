import { NextFunction, Request, Response } from "express";

import { prisma } from "../config/prisma";

import { MembershipStatus } from "@prisma/client";

export async function canAccessCourse(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const courseId = req.params.courseId;

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Curso no encontrado.",
      });
    }

    // Si el curso es gratuito
    if (!course.isPremium) {
      return next();
    }

    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No autenticado.",
      });
    }

    const membership = await prisma.membership.findUnique({
      where: {
        userId: user.userId,
      },
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "Necesitas una membresía activa.",
      });
    }

    if (membership.status !== MembershipStatus.ACTIVE) {
      return res.status(403).json({
        success: false,
        message: "Tu membresía no está activa.",
      });
    }

    if (
      membership.expiresAt &&
      membership.expiresAt < new Date()
    ) {
      return res.status(403).json({
        success: false,
        message: "Tu membresía ha expirado.",
      });
    }

    next();

  } catch (error: any) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
}