"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPayment = createPayment;
exports.getMyPayments = getMyPayments;
exports.getPayments = getPayments;
exports.getPendingPayments = getPendingPayments;
exports.getPayment = getPayment;
exports.approvePayment = approvePayment;
exports.rejectPayment = rejectPayment;
const prisma_1 = require("../../config/prisma");
const client_1 = require("@prisma/client");
/*
|--------------------------------------------------------------------------
| Crear pago
|--------------------------------------------------------------------------
*/
async function createPayment(userId, data, receipt) {
    let membership = await prisma_1.prisma.membership.findUnique({
        where: {
            userId,
        },
    });
    const pendingPayment = await prisma_1.prisma.payment.findFirst({
        where: {
            userId,
            status: client_1.PaymentStatus.PENDING,
        },
    });
    if (pendingPayment) {
        throw new Error("Ya tienes un pago pendiente de revisión.");
    }
    // Si es el primer pago del usuario,
    // se crea automáticamente su membresía.
    if (!membership) {
        membership = await prisma_1.prisma.membership.create({
            data: {
                userId,
                status: client_1.MembershipStatus.PENDING,
            },
        });
    }
    return prisma_1.prisma.payment.create({
        data: {
            amount: data.amount,
            months: data.months,
            reference: data.reference,
            membershipId: membership.id,
            userId,
            ...receipt,
        },
    });
}
/*
|--------------------------------------------------------------------------
| Mis pagos
|--------------------------------------------------------------------------
*/
async function getMyPayments(userId) {
    return prisma_1.prisma.payment.findMany({
        where: {
            userId,
        },
        include: {
            membership: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
/*
|--------------------------------------------------------------------------
| Todos los pagos (Admin)
|--------------------------------------------------------------------------
*/
async function getPayments() {
    return prisma_1.prisma.payment.findMany({
        include: {
            user: true,
            membership: true,
            reviewedBy: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
/*
|--------------------------------------------------------------------------
| Pagos pendientes
|--------------------------------------------------------------------------
*/
async function getPendingPayments() {
    return prisma_1.prisma.payment.findMany({
        where: {
            status: client_1.PaymentStatus.PENDING,
        },
        include: {
            user: true,
            membership: true,
            reviewedBy: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
}
/*
|--------------------------------------------------------------------------
| Obtener un pago
|--------------------------------------------------------------------------
*/
async function getPayment(paymentId) {
    const payment = await prisma_1.prisma.payment.findUnique({
        where: {
            id: paymentId,
        },
        include: {
            user: true,
            membership: true,
            reviewedBy: true,
        },
    });
    if (!payment) {
        throw new Error("Pago no encontrado.");
    }
    return payment;
}
/*
|--------------------------------------------------------------------------
| Aprobar pago
|--------------------------------------------------------------------------
*/
async function approvePayment(paymentId, adminId) {
    const payment = await prisma_1.prisma.payment.findUnique({
        where: {
            id: paymentId,
        },
        include: {
            membership: true,
        },
    });
    if (!payment) {
        throw new Error("Pago no encontrado.");
    }
    if (payment.status === client_1.PaymentStatus.APPROVED) {
        throw new Error("Este pago ya fue aprobado.");
    }
    if (payment.status === client_1.PaymentStatus.REJECTED) {
        throw new Error("Este pago ya fue rechazado.");
    }
    const today = new Date();
    let expiresAt = new Date();
    if (payment.membership.expiresAt &&
        payment.membership.expiresAt > today) {
        expiresAt = new Date(payment.membership.expiresAt);
    }
    expiresAt.setMonth(expiresAt.getMonth() + payment.months);
    return prisma_1.prisma.$transaction(async (tx) => {
        const updatedPayment = await tx.payment.update({
            where: {
                id: payment.id,
            },
            data: {
                status: client_1.PaymentStatus.APPROVED,
                reviewedById: adminId,
                reviewedAt: new Date(),
            },
        });
        await tx.membership.update({
            where: {
                id: payment.membershipId,
            },
            data: {
                status: client_1.MembershipStatus.ACTIVE,
                startsAt: payment.membership.startsAt ?? today,
                expiresAt,
            },
        });
        return updatedPayment;
    });
}
/*
|--------------------------------------------------------------------------
| Rechazar pago
|--------------------------------------------------------------------------
*/
async function rejectPayment(paymentId, adminId) {
    const payment = await prisma_1.prisma.payment.findUnique({
        where: {
            id: paymentId,
        },
    });
    if (!payment) {
        throw new Error("Pago no encontrado.");
    }
    if (payment.status !== client_1.PaymentStatus.PENDING) {
        throw new Error("Este pago ya fue procesado.");
    }
    return prisma_1.prisma.payment.update({
        where: {
            id: paymentId,
        },
        data: {
            status: client_1.PaymentStatus.REJECTED,
            reviewedById: adminId,
            reviewedAt: new Date(),
        },
    });
}
