"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canAccessLesson = canAccessLesson;
const client_1 = require("@prisma/client");
const prisma_1 = require("../config/prisma");
async function canAccessLesson(req, res, next) {
    try {
        const lesson = await prisma_1.prisma.lesson.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                course: true,
            },
        });
        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: "Lección no encontrada.",
            });
        }
        // La lección debe estar publicada
        if (!lesson.published) {
            return res.status(404).json({
                success: false,
                message: "Lección no encontrada.",
            });
        }
        // Si es vista previa cualquiera autenticado puede verla
        if (lesson.isPreview) {
            return next();
        }
        // Si el curso es gratuito cualquiera autenticado puede verlo
        if (!lesson.course.isPremium) {
            return next();
        }
        const user = req.user;
        const membership = await prisma_1.prisma.membership.findUnique({
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
        if (membership.status !== client_1.MembershipStatus.ACTIVE) {
            return res.status(403).json({
                success: false,
                message: "Tu membresía no está activa.",
            });
        }
        if (membership.expiresAt &&
            membership.expiresAt < new Date()) {
            return res.status(403).json({
                success: false,
                message: "Tu membresía ha expirado.",
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
