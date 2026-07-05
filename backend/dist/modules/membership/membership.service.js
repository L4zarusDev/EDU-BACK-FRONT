"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyMembership = getMyMembership;
exports.getMemberships = getMemberships;
exports.getMembership = getMembership;
const prisma_1 = require("../../config/prisma");
async function getMyMembership(userId) {
    const membership = await prisma_1.prisma.membership.findUnique({
        where: {
            userId,
        },
        include: {
            payments: {
                orderBy: {
                    createdAt: "desc",
                },
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
    if (!membership) {
        throw new Error("No tienes una membresía.");
    }
    const today = new Date();
    const daysRemaining = membership.expiresAt
        ? Math.max(0, Math.ceil((membership.expiresAt.getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24)))
        : 0;
    return {
        ...membership,
        daysRemaining,
    };
}
async function getMemberships() {
    return prisma_1.prisma.membership.findMany({
        include: {
            user: true,
            payments: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
        orderBy: {
            createdAt: "desc"
        }
    });
}
async function getMembership(userId) {
    const membership = await prisma_1.prisma.membership.findUnique({
        where: {
            userId,
        },
        include: {
            user: true,
            payments: true,
        },
    });
    if (!membership) {
        throw new Error("Membresía no encontrada.");
    }
    return membership;
}
