import { Request, Response } from "express";
import path from "path";

import {
  getLessons,
  getAllLessonsAdmin,
  getLessonInfo,
  getLessonContent,
  createLesson,
  updateLesson,
  publishLesson,
  unpublishLesson,
  enablePreview,
  disablePreview,
  deleteLesson,
} from "./lesson.service";

import {
  createLessonSchema,
  updateLessonSchema,
} from "./lesson.validation";

function getYouTubeVideoId(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtube.com" || host === "m.youtube.com") {
      const fromQuery = parsed.searchParams.get("v");
      if (fromQuery) return fromQuery;

      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/shorts/")[1]?.split("/")[0] ?? null;
      }
    }

    if (host === "youtu.be") {
      return parsed.pathname.replace(/^\//, "").split("/")[0] ?? null;
    }

    return null;
  } catch {
    return null;
  }
}

function normalizeLessonLinks<T extends { videoUrl?: string; pdfUrl?: string }>(data: T): T {
  const next = { ...data };

  if (typeof next.videoUrl === "string" && next.videoUrl.trim()) {
    const trimmed = next.videoUrl.trim();
    const youtubeId = getYouTubeVideoId(trimmed);

    if (youtubeId) {
      next.videoUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}` as T["videoUrl"];
    } else {
      next.videoUrl = trimmed as T["videoUrl"];
    }
  }

  if (typeof next.pdfUrl === "string" && next.pdfUrl.trim()) {
    next.pdfUrl = next.pdfUrl.trim() as T["pdfUrl"];
  }

  return next;
}

function buildPublicUrl(req: Request, fileName: string) {
  const relativePath = path.relative(path.resolve("uploads"), path.resolve("uploads", fileName)).replace(/\\/g, "/");
  return `${req.protocol}://${req.get("host")}/uploads/${relativePath}`;
}

export async function getAll(req: Request, res: Response) {
  try {
    const lessons = await getLessons(req.params.courseId);
    return res.json({ success: true, data: lessons });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export async function getAllAdmin(req: Request, res: Response) {
  try {
    const lessons = await getAllLessonsAdmin();
    return res.json({ success: true, data: lessons });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getOne(req: Request, res: Response) {
  try {

    const lesson = await getLessonInfo(req.params.id);

    return res.json({
      success: true,
      data: lesson,
    });

  } catch (error: any) {

    return res.status(404).json({
      success: false,
      message: error.message,
    });

  }
}

export async function view(req: Request, res: Response) {
  try {

    const lesson = await getLessonContent(req.params.id);

    return res.json({
      success: true,
      data: lesson,
    });

  } catch (error: any) {

    return res.status(404).json({
      success: false,
      message: error.message,
    });

  }
}

export async function create(req: Request, res: Response) {
  try {
    const body = normalizeLessonLinks(createLessonSchema.parse(req.body));

    const lesson = await createLesson(
      req.params.courseId,
      body
    );

    return res.status(201).json({
      success: true,
      message: "Lección creada correctamente.",
      data: lesson,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const body = normalizeLessonLinks(updateLessonSchema.parse(req.body));

    const lesson = await updateLesson(
      req.params.id,
      body
    );

    return res.json({
      success: true,
      message: "Lección actualizada.",
      data: lesson,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function publish(req: Request, res: Response) {
  try {
    const lesson = await publishLesson(req.params.id);

    return res.json({
      success: true,
      message: "Lección publicada.",
      data: lesson,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function unpublish(req: Request, res: Response) {
  try {
    const lesson = await unpublishLesson(req.params.id);

    return res.json({
      success: true,
      message: "Lección ocultada.",
      data: lesson,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function preview(req: Request, res: Response) {
  try {
    const lesson = await enablePreview(req.params.id);

    return res.json({
      success: true,
      message: "Vista previa activada.",
      data: lesson,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function removePreview(req: Request, res: Response) {
  try {
    const lesson = await disablePreview(req.params.id);

    return res.json({
      success: true,
      message: "Vista previa desactivada.",
      data: lesson,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    await deleteLesson(req.params.id);

    return res.json({
      success: true,
      message: "Lección eliminada.",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function uploadMedia(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No se recibió ningún archivo.",
      });
    }

    const isVideo = req.file.mimetype.startsWith("video/");
    const mediaUrl = buildPublicUrl(req, req.file.path.replace(path.resolve("uploads"), "").replace(/^\\/, ""));
    const lesson = await updateLesson(req.params.id, {
      [isVideo ? "videoUrl" : "pdfUrl"]: mediaUrl,
    } as any);

    return res.json({
      success: true,
      message: "Material actualizado.",
      data: lesson,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}