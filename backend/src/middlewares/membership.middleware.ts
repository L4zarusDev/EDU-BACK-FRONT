import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { MembershipStatus } from "@prisma/client";

export async function requireActiveMembership(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        message: "No autenticado.",
      });
    }

    const membership = await prisma.membership.findUnique({
      where: {
        userId: user.userId,
      },
    });

    if (!membership) {
      return res.status(403).json({
        message: "No tienes una membresía.",
      });
    }

    if (membership.status !== MembershipStatus.ACTIVE) {
      return res.status(403).json({
        message: "Tu membresía no está activa.",
      });
    }

    if (
      membership.expiresAt &&
      membership.expiresAt < new Date()
    ) {

      await prisma.membership.update({
        where: {
          id: membership.id,
        },
        data: {
          status: MembershipStatus.EXPIRED,
        },
      });

      return res.status(403).json({
        message:
          "Tu membresía ha expirado. Renueva para continuar.",
      });
    }

    next();

  } catch {

    return res.status(500).json({
      message: "Error interno.",
    });

  }
}