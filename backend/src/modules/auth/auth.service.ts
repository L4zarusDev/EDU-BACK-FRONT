import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import { RegisterInput } from "./auth.validation";
import { LoginInput } from "./auth.validation";

function isAdminEmail(email: string) {
  const configuredEmails = (process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return configuredEmails.includes(email.toLowerCase());
}

export async function registerUser(data: RegisterInput) {
  const exists = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (exists) throw new Error("El correo ya está registrado");

  const password = await bcrypt.hash(data.password, 10);
  const role = isAdminEmail(data.email) ? "ADMIN" : "STUDENT";

  return prisma.user.create({
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
export async function loginUser(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) throw new Error("Usuario no encontrado");

  const isValid = await bcrypt.compare(data.password, user.password);

  if (!isValid) throw new Error("Password incorrecta");

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

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