import { prisma } from "../../config/prisma";

import {
  CreateCourseInput,
  UpdateCourseInput,
} from "./course.validation";

export async function getCourses() {
  return prisma.course.findMany({
    where: {
      published: true,
      deletedAt: null,
    },

    include: {
      category: true,
      creator: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          lessons: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCoursesAdmin() {
  return prisma.course.findMany({
    where: {
      deletedAt: null,
    },
    include: {
      category: true,
      creator: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          lessons: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCourse(id: string) {
  const course = await prisma.course.findUnique({
    where: {
      id,
    },

     include: {
  category: true,

  creator: {
    select: {
      id: true,
      name: true,
    },
  },

  lessons: {
    select: {
      id: true,
      title: true,
      description: true,
      duration: true,
      videoUrl: true,
      pdfUrl: true,
      order: true,
      isPreview: true,
      published: true,
    },
    

    orderBy: {
      order: "asc",
    },
  },
}
    
  });

  if (!course) {
    throw new Error("Curso no encontrado.");
  }

  return course;
}

export async function getCourseBySlug(slug: string) {
  const course = await prisma.course.findFirst({
    where: {
      slug,
      published: true,
      deletedAt: null,
    },

   include: {
  category: true,

  creator: {
    select: {
      id: true,
      name: true,
    },
  },

  lessons: {
    where: {
      published: true,
    },

    select: {
      id: true,
      title: true,
      description: true,
      duration: true,
      videoUrl: true,
      pdfUrl: true,
      order: true,
      isPreview: true,
      published: true,
    },

    orderBy: {
      order: "asc",
    },
  },
},
  });

  if (!course) {
    throw new Error("Curso no encontrado.");
  }

  return course;
}

export async function createCourse(
  creatorId: string,
  data: CreateCourseInput
) {
  const exists = await prisma.course.findFirst({
    where: {
      OR: [
        {
          slug: data.slug,
        },
        {
          title: data.title,
        },
      ],
    },
  });

  if (exists) {
    throw new Error("Ya existe un curso con ese título o slug.");
  }

  return prisma.course.create({
    data: {
      ...data,
      creatorId,
    },
  });
}

export async function updateCourse(
  id: string,
  data: UpdateCourseInput
) {
  await getCourse(id);

  if (data.slug) {
    const exists = await prisma.course.findFirst({
      where: {
        slug: data.slug,
        NOT: {
          id,
        },
      },
    });

    if (exists) {
      throw new Error("El slug ya está en uso.");
    }
  }

  return prisma.course.update({
    where: {
      id,
    },
    data,
  });
}

export async function publishCourse(id: string) {
  await getCourse(id);

  return prisma.course.update({
    where: {
      id,
    },
    data: {
      published: true,
    },
  });
}

export async function unpublishCourse(id: string) {
  await getCourse(id);

  return prisma.course.update({
    where: {
      id,
    },
    data: {
      published: false,
    },
  });
}

export async function makePremium(id: string) {
  await getCourse(id);

  return prisma.course.update({
    where: {
      id,
    },
    data: {
      isPremium: true,
    },
  });
}

export async function makeFree(id: string) {
  await getCourse(id);

  return prisma.course.update({
    where: {
      id,
    },
    data: {
      isPremium: false,
    },
  });
}

export async function updateThumbnail(
  id: string,
  thumbnail: string
) {
  await getCourse(id);

  return prisma.course.update({
    where: {
      id,
    },
    data: {
      thumbnail,
    },
  });
}

export async function deleteCourse(id: string) {
  await getCourse(id);

  return prisma.course.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
      published: false,
    },
  });
}

export async function restoreCourse(id: string) {
  await getCourse(id);

  return prisma.course.update({
    where: {
      id,
    },
    data: {
      deletedAt: null,
    },
  });
}

export async function getPremiumCourses() {
  return prisma.course.findMany({
    where: {
      published: true,
      deletedAt: null,
      isPremium: true,
    },

    include: {
      category: true,
      creator: true,
    },
  });
}

export async function getFreeCourses() {
  return prisma.course.findMany({
    where: {
      published: true,
      deletedAt: null,
      isPremium: false,
    },

    include: {
      category: true,
      creator: true,
    },
  });
}