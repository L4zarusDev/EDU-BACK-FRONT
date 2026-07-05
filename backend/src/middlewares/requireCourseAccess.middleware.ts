import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";

export async function requireCourseAccess(req: Request, res: Response, next: NextFunction) {
  try {
    const { courseId } = req.params;
    const user = (req as any).userData;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    // 🔓 curso gratis
    if (!course.isPremium) {
      return next();
    }

    // 🔒 verificar membresía
    const membership = user.memberships[0];

    if (!membership || membership.status !== "ACTIVE") {
      return res.status(403).json({
        message: "Necesitas membresía activa para acceder a este curso",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Error validando acceso" });
  }
}