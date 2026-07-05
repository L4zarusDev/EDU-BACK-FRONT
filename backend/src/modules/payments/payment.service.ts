import { prisma } from "../../config/prisma";

import {
  MembershipStatus,
  PaymentStatus,
} from "@prisma/client";

import { CreatePaymentInput } from "./payment.validation";

interface ReceiptData {
  receiptUrl?: string;
  receiptName?: string;
  receiptMimeType?: string;
  receiptSize?: number;
}

/*
|--------------------------------------------------------------------------
| Crear pago
|--------------------------------------------------------------------------
*/

export async function createPayment(
  userId: string,
  data: CreatePaymentInput,
  receipt: ReceiptData
) {
  let membership = await prisma.membership.findUnique({
    where: {
      userId,
    },
  });

  const pendingPayment = await prisma.payment.findFirst({
  where: {
    userId,
    status: PaymentStatus.PENDING,
  },
});

if (pendingPayment) {
  throw new Error(
    "Ya tienes un pago pendiente de revisión."
  );
}

  // Si es el primer pago del usuario,
  // se crea automáticamente su membresía.
  if (!membership) {
    membership = await prisma.membership.create({
      data: {
        userId,
        status: MembershipStatus.PENDING,
      },
    });
  }

  

  return prisma.payment.create({
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

export async function getMyPayments(userId: string) {
  return prisma.payment.findMany({
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

export async function getPayments() {
  return prisma.payment.findMany({
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

export async function getPendingPayments() {
  return prisma.payment.findMany({
    where: {
      status: PaymentStatus.PENDING,
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

export async function getPayment(paymentId: string) {
  const payment = await prisma.payment.findUnique({
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

export async function approvePayment(
  paymentId: string,
  adminId: string
) {
  const payment = await prisma.payment.findUnique({
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

  if (payment.status === PaymentStatus.APPROVED) {
    throw new Error("Este pago ya fue aprobado.");
  }

  if (payment.status === PaymentStatus.REJECTED) {
    throw new Error("Este pago ya fue rechazado.");
  }

  const today = new Date();

  let expiresAt = new Date();

  if (
    payment.membership.expiresAt &&
    payment.membership.expiresAt > today
  ) {
    expiresAt = new Date(payment.membership.expiresAt);
  }

  expiresAt.setMonth(
    expiresAt.getMonth() + payment.months
  );

  return prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: {
        id: payment.id,
      },

      data: {
        status: PaymentStatus.APPROVED,

        reviewedById: adminId,

        reviewedAt: new Date(),
      },
    });

    await tx.membership.update({
      where: {
        id: payment.membershipId,
      },

      data: {
        status: MembershipStatus.ACTIVE,

        startsAt:
          payment.membership.startsAt ?? today,

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

export async function rejectPayment(
  paymentId: string,
  adminId: string
) {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
  });

  if (!payment) {
    throw new Error("Pago no encontrado.");
  }

  if (payment.status !== PaymentStatus.PENDING) {
    throw new Error(
      "Este pago ya fue procesado."
    );
  }

  return prisma.payment.update({
    where: {
      id: paymentId,
    },

    data: {
      status: PaymentStatus.REJECTED,

      reviewedById: adminId,

      reviewedAt: new Date(),
    },
  });
}

