"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadUser = loadUser;
const prisma_1 = require("../config/prisma");
async function loadUser(req, res, next) {
    try {
        const auth = req.user;
        if (!auth?.userId) {
            return res.status(401).json({ message: "No autenticado" });
        }
        const user = await prisma_1.prisma.user.findUnique({
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
        req.userData = user;
        next();
    }
    catch (error) {
        return res.status(500).json({ message: "Error cargando usuario" });
    }
}
