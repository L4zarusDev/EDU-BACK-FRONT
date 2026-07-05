import { prisma } from "../../config/prisma";

export async function getMyMembership(userId: string) {

  const membership = await prisma.membership.findUnique({

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
    ? Math.max(
        0,
        Math.ceil(
          (membership.expiresAt.getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  return {
    ...membership,
    daysRemaining,
  };
}

export async function getMemberships() {

  return prisma.membership.findMany({

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

export async function getMembership(userId: string) {

  const membership = await prisma.membership.findUnique({

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

