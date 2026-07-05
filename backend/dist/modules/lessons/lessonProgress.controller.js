"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeLesson = completeLesson;
exports.getCourseProgress = getCourseProgress;
const prisma_1 = require("../../config/prisma");
async function completeLesson(req, res) {
    try {
        const user = req.user;
        const { lessonId } = req.params;
        const lesson = await prisma_1.prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { course: true },
        });
        if (!lesson) {
            return res.status(404).json({ message: "Lección no encontrada" });
        }
        // crear o actualizar progreso
        const progress = await prisma_1.prisma.lessonProgress.upsert({
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
    }
    catch (error) {
        return res.status(400).json({ message: "Error al completar lección" });
    }
}
async function getCourseProgress(req, res) {
    try {
        const user = req.user;
        const { courseId } = req.params;
        const lessons = await prisma_1.prisma.lesson.findMany({
            where: { courseId },
        });
        const completed = await prisma_1.prisma.lessonProgress.findMany({
            where: {
                userId: user.userId,
                lesson: {
                    courseId,
                },
                completed: true,
            },
        });
        const progress = lessons.length === 0
            ? 0
            : Math.round((completed.length / lessons.length) * 100);
        return res.json({
            totalLessons: lessons.length,
            completed: completed.length,
            progress,
        });
    }
    catch (error) {
        return res.status(400).json({ message: "Error obteniendo progreso" });
    }
}
