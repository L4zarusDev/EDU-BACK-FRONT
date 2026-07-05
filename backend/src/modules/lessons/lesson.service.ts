import { prisma } from "../../config/prisma";

import {
  CreateLessonInput,
  UpdateLessonInput,
} from "./lesson.validation";

async function getLesson(id: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
  });

  if (!lesson) {
    throw new Error("Lección no encontrada.");
  }

  return lesson;
}

export async function getLessons(courseId: string) {
  return prisma.lesson.findMany({
    where: { courseId },
    orderBy: { order: "asc" },
  });
}

export async function getAllLessonsAdmin() {
  return prisma.lesson.findMany({
    include: {
      course: {
        select: { id: true, title: true, slug: true },
      },
    },
    orderBy: [
      { course: { title: "asc" } },
      { order: "asc" },
    ],
  });
}


export async function getLessonInfo(id: string) {
  const lesson = await prisma.lesson.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      title: true,
      description: true,
      order: true,
      duration: true,
      isPreview: true,
      published: true,

      course: {
        select: {
          id: true,
          title: true,
          isPremium: true,
        },
      },
    },
  });

  if (!lesson) {
    throw new Error("Lección no encontrada.");
  }

  return lesson;
}

export async function getLessonContent(id: string) {
  const lesson = await prisma.lesson.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      title: true,
      description: true,
      duration: true,
      videoUrl: true,
      pdfUrl: true,

      course: {
        select: {
          id: true,
          isPremium: true,
        },
      },
    },
  });

  if (!lesson) {
    throw new Error("Lección no encontrada.");
  }

  return lesson;
}



export async function createLesson(
  courseId: string,
  data: CreateLessonInput
) {
  const total = await prisma.lesson.count({
    where: {
      courseId,
    },
  });

  return prisma.lesson.create({
    data: {
      ...data,

      courseId,

      order: total + 1,
    },
  });
}

export async function updateLesson(
  id: string,
  data: UpdateLessonInput
) {
  await getLesson(id);

  return prisma.lesson.update({
    where: {
      id,
    },
    data,
  });
}

export async function publishLesson(id: string) {
  await getLesson(id);

  return prisma.lesson.update({
    where: {
      id,
    },
    data: {
      published: true,
    },
  });
}

export async function unpublishLesson(id: string) {
  await getLesson(id);

  return prisma.lesson.update({
    where: {
      id,
    },
    data: {
      published: false,
    },
  });
}

export async function enablePreview(id: string) {
  await getLesson(id);

  return prisma.lesson.update({
    where: {
      id,
    },
    data: {
      isPreview: true,
    },
  });
}

export async function disablePreview(id: string) {
  await getLesson(id);

  return prisma.lesson.update({
    where: {
      id,
    },
    data: {
      isPreview: false,
    },
  });
}

export async function deleteLesson(id: string) {
  await getLesson(id);

  return prisma.lesson.delete({
    where: {
      id,
    },
  });
}

