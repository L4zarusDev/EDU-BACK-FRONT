"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLessons = getLessons;
exports.getAllLessonsAdmin = getAllLessonsAdmin;
exports.getLessonInfo = getLessonInfo;
exports.getLessonContent = getLessonContent;
exports.createLesson = createLesson;
exports.updateLesson = updateLesson;
exports.publishLesson = publishLesson;
exports.unpublishLesson = unpublishLesson;
exports.enablePreview = enablePreview;
exports.disablePreview = disablePreview;
exports.deleteLesson = deleteLesson;
const prisma_1 = require("../../config/prisma");
async function getLesson(id) {
    const lesson = await prisma_1.prisma.lesson.findUnique({
        where: { id },
    });
    if (!lesson) {
        throw new Error("Lección no encontrada.");
    }
    return lesson;
}
async function getLessons(courseId) {
    return prisma_1.prisma.lesson.findMany({
        where: { courseId },
        orderBy: { order: "asc" },
    });
}
async function getAllLessonsAdmin() {
    return prisma_1.prisma.lesson.findMany({
        include: {
            course: {
                select: { id: true, title: true, slug: true },
            },
        },
        orderBy: [
            { course: { title: "asc" } },
            { order: "asc" },
        ],
    });
}
async function getLessonInfo(id) {
    const lesson = await prisma_1.prisma.lesson.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            title: true,
            description: true,
            order: true,
            duration: true,
            isPreview: true,
            published: true,
            course: {
                select: {
                    id: true,
                    title: true,
                    isPremium: true,
                },
            },
        },
    });
    if (!lesson) {
        throw new Error("Lección no encontrada.");
    }
    return lesson;
}
async function getLessonContent(id) {
    const lesson = await prisma_1.prisma.lesson.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            title: true,
            description: true,
            duration: true,
            videoUrl: true,
            pdfUrl: true,
            course: {
                select: {
                    id: true,
                    isPremium: true,
                },
            },
        },
    });
    if (!lesson) {
        throw new Error("Lección no encontrada.");
    }
    return lesson;
}
async function createLesson(courseId, data) {
    const total = await prisma_1.prisma.lesson.count({
        where: {
            courseId,
        },
    });
    return prisma_1.prisma.lesson.create({
        data: {
            ...data,
            courseId,
            order: total + 1,
        },
    });
}
async function updateLesson(id, data) {
    await getLesson(id);
    return prisma_1.prisma.lesson.update({
        where: {
            id,
        },
        data,
    });
}
async function publishLesson(id) {
    await getLesson(id);
    return prisma_1.prisma.lesson.update({
        where: {
            id,
        },
        data: {
            published: true,
        },
    });
}
async function unpublishLesson(id) {
    await getLesson(id);
    return prisma_1.prisma.lesson.update({
        where: {
            id,
        },
        data: {
            published: false,
        },
    });
}
async function enablePreview(id) {
    await getLesson(id);
    return prisma_1.prisma.lesson.update({
        where: {
            id,
        },
        data: {
            isPreview: true,
        },
    });
}
async function disablePreview(id) {
    await getLesson(id);
    return prisma_1.prisma.lesson.update({
        where: {
            id,
        },
        data: {
            isPreview: false,
        },
    });
}
async function deleteLesson(id) {
    await getLesson(id);
    return prisma_1.prisma.lesson.delete({
        where: {
            id,
        },
    });
}
