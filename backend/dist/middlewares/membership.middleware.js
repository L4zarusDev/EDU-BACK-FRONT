"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireActiveMembership = requireActiveMembership;
const prisma_1 = require("../config/prisma");
const client_1 = require("@prisma/client");
async function requireActiveMembership(req, res, next) {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
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
                message: "No tienes una membresía.",
            });
        }
        if (membership.status !== client_1.MembershipStatus.ACTIVE) {
            return res.status(403).json({
                message: "Tu membresía no está activa.",
            });
        }
        if (membership.expiresAt &&
            membership.expiresAt < new Date()) {
            await prisma_1.prisma.membership.update({
                where: {
                    id: membership.id,
                },
                data: {
                    status: client_1.MembershipStatus.EXPIRED,
                },
            });
            return res.status(403).json({
                message: "Tu membresía ha expirado. Renueva para continuar.",
            });
        }
        next();
    }
    catch {
        return res.status(500).json({
            message: "Error interno.",
        });
    }
}
