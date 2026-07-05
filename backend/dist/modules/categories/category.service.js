"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategories = getAllCategories;
exports.getCategory = getCategory;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
exports.getAllCategoriesAdmin = getAllCategoriesAdmin;
exports.restoreCategory = restoreCategory;
const prisma_1 = require("../../config/prisma");
async function getAllCategories() {
    return prisma_1.prisma.category.findMany({
        where: {
            isActive: true,
        },
        orderBy: {
            order: "asc",
        },
    });
}
async function getCategory(id) {
    const category = await prisma_1.prisma.category.findUnique({
        where: {
            id,
        },
    });
    if (!category) {
        throw new Error("Categoría no encontrada.");
    }
    return category;
}
async function createCategory(data) {
    const exists = await prisma_1.prisma.category.findUnique({
        where: {
            name: data.name,
        },
    });
    if (exists) {
        throw new Error("Ya existe una categoría con ese nombre.");
    }
    return prisma_1.prisma.category.create({
        data,
    });
}
async function updateCategory(id, data) {
    await getCategory(id);
    if (data.name) {
        const exists = await prisma_1.prisma.category.findFirst({
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
    return prisma_1.prisma.category.update({
        where: {
            id,
        },
        data,
    });
}
async function deleteCategory(id) {
    await getCategory(id);
    return prisma_1.prisma.category.update({
        where: {
            id,
        },
        data: {
            isActive: false,
        },
    });
}
async function getAllCategoriesAdmin() {
    return prisma_1.prisma.category.findMany({
        orderBy: {
            order: "asc",
        },
    });
}
async function restoreCategory(id) {
    return prisma_1.prisma.category.update({
        where: {
            id,
        },
        data: {
            isActive: true,
        },
    });
}
