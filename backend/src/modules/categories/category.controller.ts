import { Request, Response } from "express";
import { ZodError } from "zod";

import {
  getAllCategories,
  getAllCategoriesAdmin,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
} from "./category.service";

import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.validation";

export async function getAll(req: Request, res: Response) {
  try {
    const categories = await getAllCategories();

    return res.json({
      success: true,
      data: categories,
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
    const categories = await getAllCategoriesAdmin();

    return res.json({
      success: true,
      data: categories,
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
    const category = await getCategory(req.params.id);

    return res.json({
      success: true,
      data: category,
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
    const body = createCategorySchema.parse(req.body);

    const category = await createCategory(body);

    return res.status(201).json({
      success: true,
      message: "Categoría creada correctamente.",
      data: category,
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
    const body = updateCategorySchema.parse(req.body);

    const category = await updateCategory(
      req.params.id,
      body
    );

    return res.json({
      success: true,
      message: "Categoría actualizada correctamente.",
      data: category,
    });
  } catch (error: unknown) {
    return res.status(400).json({
      success: false,
      message: buildErrorMessage(error),
    });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const category = await deleteCategory(req.params.id);

    return res.json({
      success: true,
      message: "Categoría desactivada correctamente.",
      data: category,
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
    const category = await restoreCategory(req.params.id);

    return res.json({
      success: true,
      message: "Categoría restaurada correctamente.",
      data: category,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}