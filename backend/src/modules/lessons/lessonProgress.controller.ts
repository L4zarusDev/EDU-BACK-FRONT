import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

export async function completeLesson(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { lessonId } = req.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { course: true },
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lección no encontrada" });
    }

    // crear o actualizar progreso
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.userId,
          lessonId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId: user.userId,
        lessonId,
        completed: true,
        completedAt: new Date(),
      },
    });

    return res.json(progress);
  } catch (error) {
    return res.status(400).json({ message: "Error al completar lección" });
  }
}

export async function getCourseProgress(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { courseId } = req.params;

    const lessons = await prisma.lesson.findMany({
      where: { courseId },
    });

    const completed = await prisma.lessonProgress.findMany({
      where: {
        userId: user.userId,
        lesson: {
          courseId,
        },
        completed: true,
      },
    });

    const progress =
      lessons.length === 0
        ? 0
        : Math.round((completed.length / lessons.length) * 100);

    return res.json({
      totalLessons: lessons.length,
      completed: completed.length,
      progress,
    });
  } catch (error) {
    return res.status(400).json({ message: "Error obteniendo progreso" });
  }
}