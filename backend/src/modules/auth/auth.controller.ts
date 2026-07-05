import { Request, Response } from "express";
import { registerSchema } from "./auth.validation";
import { registerUser } from "./auth.service";
import { loginUser } from "./auth.service";
import { loginSchema } from "./auth.validation";

export async function register(req: Request, res: Response) {
  try {
    const data = registerSchema.parse(req.body);

    const user = await registerUser(data);

    return res.status(201).json(user);
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message: "No fue posible registrar el usuario.",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const data = loginSchema.parse(req.body);

    const result = await loginUser(data);

    return res.json(result);
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message: "Error al iniciar sesión",
    });
  }
}