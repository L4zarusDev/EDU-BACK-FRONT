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

app.use(cors());
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