import { Request, Response } from "express";

import {
  getMyMembership,
  getMemberships,
  getMembership,
} from "./membership.service";

/*
|--------------------------------------------------------------------------
| Mi membresía
|--------------------------------------------------------------------------
*/

export async function me(req: Request, res: Response) {
  try {
    const user = (req as any).user;

    const membership = await getMyMembership(user.userId);

    return res.json({
      success: true,
      data: membership,
    });

  } catch (error: any) {

    return res.status(404).json({
      success: false,
      message: error.message,
    });

  }
}

/*
|--------------------------------------------------------------------------
| Todas las membresías (Admin)
|--------------------------------------------------------------------------
*/

export async function all(req: Request, res: Response) {
  try {

    const memberships = await getMemberships();

    return res.json({
      success: true,
      data: memberships,
    });

  } catch (error: any) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
}

/*
|--------------------------------------------------------------------------
| Membresía de un usuario (Admin)
|--------------------------------------------------------------------------
*/

export async function getOne(req: Request, res: Response) {
  try {

    const membership = await getMembership(req.params.userId);

    return res.json({
      success: true,
      data: membership,
    });

  } catch (error: any) {

    return res.status(404).json({
      success: false,
      message: error.message,
    });

  }
}