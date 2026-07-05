import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";

export async function loadUser(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = (req as any).user;

    if (!auth?.userId) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      include: {
        memberships: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Usuario no existe" });
    }

    (req as any).userData = user;

    next();
  } catch (error) {
    return res.status(500).json({ message: "Error cargando usuario" });
  }
}