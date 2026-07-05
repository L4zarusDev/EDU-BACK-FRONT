"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourses = getCourses;
exports.getCoursesAdmin = getCoursesAdmin;
exports.getCourse = getCourse;
exports.getCourseBySlug = getCourseBySlug;
exports.createCourse = createCourse;
exports.updateCourse = updateCourse;
exports.publishCourse = publishCourse;
exports.unpublishCourse = unpublishCourse;
exports.makePremium = makePremium;
exports.makeFree = makeFree;
exports.updateThumbnail = updateThumbnail;
exports.deleteCourse = deleteCourse;
exports.restoreCourse = restoreCourse;
exports.getPremiumCourses = getPremiumCourses;
exports.getFreeCourses = getFreeCourses;
const prisma_1 = require("../../config/prisma");
async function getCourses() {
    return prisma_1.prisma.course.findMany({
        where: {
            published: true,
            deletedAt: null,
        },
        include: {
            category: true,
            creator: {
                select: {
                    id: true,
                    name: true,
                },
            },
            _count: {
                select: {
                    lessons: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
async function getCoursesAdmin() {
    return prisma_1.prisma.course.findMany({
        where: {
            deletedAt: null,
        },
        include: {
            category: true,
            creator: {
                select: {
                    id: true,
                    name: true,
                },
            },
            _count: {
                select: {
                    lessons: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
async function getCourse(id) {
    const course = await prisma_1.prisma.course.findUnique({
        where: {
            id,
        },
        include: {
            category: true,
            creator: {
                select: {
                    id: true,
                    name: true,
                },
            },
            lessons: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    duration: true,
                    videoUrl: true,
                    pdfUrl: true,
                    order: true,
                    isPreview: true,
                    published: true,
                },
                orderBy: {
                    order: "asc",
                },
            },
        }
    });
    if (!course) {
        throw new Error("Curso no encontrado.");
    }
    return course;
}
async function getCourseBySlug(slug) {
    const course = await prisma_1.prisma.course.findFirst({
        where: {
            slug,
            published: true,
            deletedAt: null,
        },
        include: {
            category: true,
            creator: {
                select: {
                    id: true,
                    name: true,
                },
            },
            lessons: {
                where: {
                    published: true,
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    duration: true,
                    videoUrl: true,
                    pdfUrl: true,
                    order: true,
                    isPreview: true,
                    published: true,
                },
                orderBy: {
                    order: "asc",
                },
            },
        },
    });
    if (!course) {
        throw new Error("Curso no encontrado.");
    }
    return course;
}
async function createCourse(creatorId, data) {
    const exists = await prisma_1.prisma.course.findFirst({
        where: {
            OR: [
                {
                    slug: data.slug,
                },
                {
                    title: data.title,
                },
            ],
        },
    });
    if (exists) {
        throw new Error("Ya existe un curso con ese título o slug.");
    }
    return prisma_1.prisma.course.create({
        data: {
            ...data,
            creatorId,
        },
    });
}
async function updateCourse(id, data) {
    await getCourse(id);
    if (data.slug) {
        const exists = await prisma_1.prisma.course.findFirst({
            where: {
                slug: data.slug,
                NOT: {
                    id,
                },
            },
        });
        if (exists) {
            throw new Error("El slug ya está en uso.");
        }
    }
    return prisma_1.prisma.course.update({
        where: {
            id,
        },
        data,
    });
}
async function publishCourse(id) {
    await getCourse(id);
    return prisma_1.prisma.course.update({
        where: {
            id,
        },
        data: {
            published: true,
        },
    });
}
async function unpublishCourse(id) {
    await getCourse(id);
    return prisma_1.prisma.course.update({
        where: {
            id,
        },
        data: {
            published: false,
        },
    });
}
async function makePremium(id) {
    await getCourse(id);
    return prisma_1.prisma.course.update({
        where: {
            id,
        },
        data: {
            isPremium: true,
        },
    });
}
async function makeFree(id) {
    await getCourse(id);
    return prisma_1.prisma.course.update({
        where: {
            id,
        },
        data: {
            isPremium: false,
        },
    });
}
async function updateThumbnail(id, thumbnail) {
    await getCourse(id);
    return prisma_1.prisma.course.update({
        where: {
            id,
        },
        data: {
            thumbnail,
        },
    });
}
async function deleteCourse(id) {
    await getCourse(id);
    return prisma_1.prisma.course.update({
        where: {
            id,
        },
        data: {
            deletedAt: new Date(),
            published: false,
        },
    });
}
async function restoreCourse(id) {
    await getCourse(id);
    return prisma_1.prisma.course.update({
        where: {
            id,
        },
        data: {
            deletedAt: null,
        },
    });
}
async function getPremiumCourses() {
    return prisma_1.prisma.course.findMany({
        where: {
            published: true,
            deletedAt: null,
            isPremium: true,
        },
        include: {
            category: true,
            creator: true,
        },
    });
}
async function getFreeCourses() {
    return prisma_1.prisma.course.findMany({
        where: {
            published: true,
            deletedAt: null,
            isPremium: false,
        },
        include: {
            category: true,
            creator: true,
        },
    });
}
