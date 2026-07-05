import { Request, Response } from "express";
import path from "path";
import { ZodError } from "zod";

import {
  getCourses,
  getCoursesAdmin,
  getCourse,
  getCourseBySlug,
  createCourse,
  updateCourse,
  publishCourse,
  unpublishCourse,
  makePremium,
  makeFree,
  updateThumbnail,
  deleteCourse,
  restoreCourse,
  getPremiumCourses,
  getFreeCourses,
} from "./course.service";

import {
  createCourseSchema,
  updateCourseSchema,
} from "./course.validation";

function buildPublicUrl(req: Request, fileName: string) {
  const relativePath = path.relative(path.resolve("uploads"), path.resolve("uploads", fileName)).replace(/\\/g, "/");
  return `${req.protocol}://${req.get("host")}/uploads/${relativePath}`;
}

export async function getAll(req: Request, res: Response) {
  try {
    const courses = await getCourses();

    return res.json({
      success: true,
      data: courses,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getAllAdmin(req: Request, res: Response) {
  try {
    const courses = await getCoursesAdmin();

    return res.json({
      success: true,
      data: courses,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    const course = await getCourse(req.params.id);

    return res.json({
      success: true,
      data: course,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getBySlug(req: Request, res: Response) {
  try {
    const course = await getCourseBySlug(req.params.slug);

    return res.json({
      success: true,
      data: course,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

function buildErrorMessage(error: unknown) {
  if (error instanceof ZodError) {
    return error.errors
      .map((issue) => `${issue.path.join('.') || 'input'}: ${issue.message}`)
      .join(', ');
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Error en la solicitud.';
}

export async function create(req: Request, res: Response) {
  try {
    const body = createCourseSchema.parse(req.body);

    const user = (req as any).user;

    const course = await createCourse(user.userId, body);

    return res.status(201).json({
      success: true,
      message: "Curso creado correctamente.",
      data: course,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message: buildErrorMessage(error),
    });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const body = updateCourseSchema.parse(req.body);

    const course = await updateCourse(req.params.id, body);

    return res.json({
      success: true,
      message: "Curso actualizado correctamente.",
      data: course,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message: buildErrorMessage(error),
    });
  }
}

export async function publish(req: Request, res: Response) {
  try {
    const course = await publishCourse(req.params.id);

    return res.json({
      success: true,
      message: "Curso publicado.",
      data: course,
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
    const course = await unpublishCourse(req.params.id);

    return res.json({
      success: true,
      message: "Curso ocultado.",
      data: course,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function premium(req: Request, res: Response) {
  try {
    const course = await makePremium(req.params.id);

    return res.json({
      success: true,
      message: "Curso convertido en premium.",
      data: course,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function free(req: Request, res: Response) {
  try {
    const course = await makeFree(req.params.id);

    return res.json({
      success: true,
      message: "Curso convertido en gratuito.",
      data: course,
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
    const course = await deleteCourse(req.params.id);

    return res.json({
      success: true,
      message: "Curso eliminado.",
      data: course,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function restore(req: Request, res: Response) {
  try {
    const course = await restoreCourse(req.params.id);

    return res.json({
      success: true,
      message: "Curso restaurado.",
      data: course,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function thumbnail(req: Request, res: Response) {
  try {
    const { thumbnail } = req.body;

    const course = await updateThumbnail(
      req.params.id,
      thumbnail
    );

    return res.json({
      success: true,
      message: "Miniatura actualizada.",
      data: course,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function uploadThumbnail(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No se recibió ningún archivo.",
      });
    }

    const thumbnail = buildPublicUrl(req, req.file.path.replace(path.resolve("uploads"), "").replace(/^\\/, ""));
    const course = await updateThumbnail(req.params.id, thumbnail);

    return res.json({
      success: true,
      message: "Miniatura actualizada.",
      data: course,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function premiumCourses(req: Request, res: Response) {
  const data = await getPremiumCourses();

  return res.json({
    success: true,
    data,
  });
}

export async function freeCourses(req: Request, res: Response) {
  const data = await getFreeCourses();

  return res.json({
    success: true,
    data,
  });
}