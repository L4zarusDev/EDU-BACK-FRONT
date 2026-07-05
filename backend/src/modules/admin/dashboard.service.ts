import { prisma } from "../../config/prisma";

import {
    MembershipStatus,
    PaymentStatus
} from "@prisma/client";

export async function getDashboard() {

    const [

        users,

        categories,

        courses,

        unpublishedCourses,

        lessons,

        pendingPayments,

        approvedPayments,

        activeMemberships,

        pendingMemberships,

        expiredMemberships,

    ] = await Promise.all([

        prisma.user.count(),

        prisma.category.count(),

        prisma.course.count({
            where:{
                published:true
            }
        }),

        prisma.course.count({
            where:{
                published:false
            }
        }),

        prisma.lesson.count(),

        prisma.payment.count({
            where:{
                status:PaymentStatus.PENDING
            }
        }),

        prisma.payment.count({
            where:{
                status:PaymentStatus.APPROVED
            }
        }),

        prisma.membership.count({
            where:{
                status:MembershipStatus.ACTIVE
            }
        }),

        prisma.membership.count({
            where:{
                status:MembershipStatus.PENDING
            }
        }),

        prisma.membership.count({
            where:{
                status:MembershipStatus.EXPIRED
            }
        }),

    ]);

    return{

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