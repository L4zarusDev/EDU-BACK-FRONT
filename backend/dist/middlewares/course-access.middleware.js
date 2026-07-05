"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canAccessCourse = canAccessCourse;
const prisma_1 = require("../config/prisma");
const client_1 = require("@prisma/client");
async function canAccessCourse(req, res, next) {
    try {
        const courseId = req.params.courseId;
        const course = await prisma_1.prisma.course.findUnique({
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
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "No autenticado.",
            });
        }
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
