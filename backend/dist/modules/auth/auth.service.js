"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../config/prisma");
function isAdminEmail(email) {
    const configuredEmails = (process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? "")
        .split(",")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean);
    return configuredEmails.includes(email.toLowerCase());
}
async function registerUser(data) {
    const exists = await prisma_1.prisma.user.findUnique({
        where: { email: data.email },
    });
    if (exists)
        throw new Error("El correo ya está registrado");
    const password = await bcrypt_1.default.hash(data.password, 10);
    const role = isAdminEmail(data.email) ? "ADMIN" : "STUDENT";
    return prisma_1.prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password,
            role,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
}
//NEW 👇 LOGIN
async function loginUser(data) {
    const user = await prisma_1.prisma.user.findUnique({
        where: { email: data.email },
    });
    if (!user)
        throw new Error("Usuario no encontrado");
    const isValid = await bcrypt_1.default.compare(data.password, user.password);
    if (!isValid)
        throw new Error("Password incorrecta");
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
        role: user.role,
    }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
}
