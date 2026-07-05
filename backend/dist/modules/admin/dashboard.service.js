"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = getDashboard;
const prisma_1 = require("../../config/prisma");
const client_1 = require("@prisma/client");
async function getDashboard() {
    const [users, categories, courses, unpublishedCourses, lessons, pendingPayments, approvedPayments, activeMemberships, pendingMemberships, expiredMemberships,] = await Promise.all([
        prisma_1.prisma.user.count(),
        prisma_1.prisma.category.count(),
        prisma_1.prisma.course.count({
            where: {
                published: true
            }
        }),
        prisma_1.prisma.course.count({
            where: {
                published: false
            }
        }),
        prisma_1.prisma.lesson.count(),
        prisma_1.prisma.payment.count({
            where: {
                status: client_1.PaymentStatus.PENDING
            }
        }),
        prisma_1.prisma.payment.count({
            where: {
                status: client_1.PaymentStatus.APPROVED
            }
        }),
        prisma_1.prisma.membership.count({
            where: {
                status: client_1.MembershipStatus.ACTIVE
            }
        }),
        prisma_1.prisma.membership.count({
            where: {
                status: client_1.MembershipStatus.PENDING
            }
        }),
        prisma_1.prisma.membership.count({
            where: {
                status: client_1.MembershipStatus.EXPIRED
            }
        }),
    ]);
    return {
        users,
        categories,
        courses,
        unpublishedCourses,
        lessons,
        pendingPayments,
        approvedPayments,
        activeMemberships,
        pendingMemberships,
        expiredMemberships
    };
}
