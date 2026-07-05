"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const auth_middleware_1 = require("./middlewares/auth.middleware");
const course_routes_1 = __importDefault(require("./modules/courses/course.routes"));
const lesson_routes_1 = __importDefault(require("./modules/lessons/lesson.routes"));
const payment_routes_1 = __importDefault(require("./modules/payments/payment.routes"));
const dashboard_routes_1 = __importDefault(require("./modules/admin/dashboard.routes"));
const category_routes_1 = __importDefault(require("./modules/categories/category.routes"));
const membership_routes_1 = __importDefault(require("./modules/membership/membership.routes"));
const app = (0, express_1.default)();
const allowedOrigins = [
    process.env.FRONTEND_URL,
    ...(process.env.CORS_ORIGINS?.split(",") ?? []),
]
    .map((origin) => origin?.trim())
    .filter((origin) => Boolean(origin));
app.use((0, cors_1.default)({
    origin(origin, callback) {
        // Allow server-to-server tools (curl/Postman) and same-origin requests.
        if (!origin) {
            callback(null, true);
            return;
        }
        if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error("Origen no permitido por CORS"));
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.get("/", (_, res) => {
    res.json({
        message: "EduPlatform API 🚀",
    });
});
app.use("/uploads", express_1.default.static(path_1.default.resolve("uploads"), {
    setHeaders(res, filePath) {
        if (filePath.endsWith(".pdf")) {
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "inline");
        }
    },
}));
app.use("/api/auth", auth_routes_1.default);
app.get("/api/me", auth_middleware_1.authMiddleware, (req, res) => {
    res.json({
        message: "Usuario autenticado",
        user: req.user,
    });
});
app.use("/api/courses", course_routes_1.default);
app.use("/api/lessons", lesson_routes_1.default);
app.use("/api/payments", payment_routes_1.default);
app.use("/api/admin/dashboard", dashboard_routes_1.default);
app.use("/api/categories", category_routes_1.default);
app.use("/api/membership", membership_routes_1.default);
exports.default = app;
