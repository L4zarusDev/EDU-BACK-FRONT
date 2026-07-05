import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./modules/auth/auth.routes";
import { authMiddleware } from "./middlewares/auth.middleware";
import courseRoutes from "./modules/courses/course.routes";
import lessonRoutes from "./modules/lessons/lesson.routes";
import paymentRoutes from "./modules/payments/payment.routes";
import dashboardRoutes from "./modules/admin/dashboard.routes";
import categoryRoutes from "./modules/categories/category.routes";
import membershipRoutes from "./modules/membership/membership.routes";

const app = express();

function normalizeOrigin(origin: string) {
  return origin.trim().replace(/\/+$/, "");
}

const allowedOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.CORS_ORIGINS?.split(",") ?? []),
]
  .map((origin) => origin?.trim())
  .filter((origin): origin is string => Boolean(origin))
  .map(normalizeOrigin);

const allowedOriginSet = new Set(allowedOrigins);

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server tools (curl/Postman) and same-origin requests.
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = normalizeOrigin(origin);

      if (allowedOriginSet.size === 0 || allowedOriginSet.has(normalizedOrigin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origen no permitido por CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    message: "EduPlatform API 🚀",
  });
});

app.use(
  "/uploads",
  express.static(path.resolve("uploads"), {
    setHeaders(res, filePath) {
      if (filePath.endsWith(".pdf")) {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline");
      }
    },
  })
);

app.use("/api/auth", authRoutes);

app.get("/api/me", authMiddleware, (req, res) => {
  res.json({
    message: "Usuario autenticado",
    user: (req as any).user,
  });
});

app.use("/api/courses", courseRoutes);

app.use("/api/lessons", lessonRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/admin/dashboard", dashboardRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/membership", membershipRoutes);

export default app;