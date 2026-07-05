"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
function requireRole(...roles) {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                message: "No autenticado.",
            });
        }
        if (!roles.includes(user.role)) {
            return res.status(403).json({
                message: "No tienes permisos para realizar esta acción.",
            });
        }
        next();
    };
}
