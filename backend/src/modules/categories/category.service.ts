import { prisma } from "../../config/prisma";

import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.validation";

export async function getAllCategories() {
  return prisma.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      order: "asc",
    },
  });
}

export async function getCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new Error("Categoría no encontrada.");
  }

  return category;
}

export async function createCategory(
  data: CreateCategoryInput
) {
  const exists = await prisma.category.findUnique({
    where: {
      name: data.name,
    },
  });

  if (exists) {
    throw new Error("Ya existe una categoría con ese nombre.");
  }

  return prisma.category.create({
    data,
  });
}

export async function updateCategory(
  id: string,
  data: UpdateCategoryInput
) {
  await getCategory(id);

  if (data.name) {
    const exists = await prisma.category.findFirst({
      where: {
        name: data.name,
        NOT: {
          id,
        },
      },
    });

    if (exists) {
      throw new Error("Ya existe una categoría con ese nombre.");
    }
  }

  return prisma.category.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteCategory(id: string) {
  await getCategory(id);

  return prisma.category.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });
}

export async function getAllCategoriesAdmin() {
  return prisma.category.findMany({
    orderBy: {
      order: "asc",
    },
  });
}

export async function restoreCategory(id: string) {
  return prisma.category.update({
    where: {
      id,
    },
    data: {
      isActive: true,
    },
  });
}