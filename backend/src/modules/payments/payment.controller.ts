import { Request, Response } from "express";
import path from "path";

import {
  createPayment,
  getMyPayments,
  getPayments,
  getPendingPayments,
  getPayment,
  approvePayment,
  rejectPayment,
} from "./payment.service";

import { createPaymentSchema } from "./payment.validation";

function buildPublicUrl(req: Request, filePath: string) {
  const uploadsRoot = path.resolve("uploads");
  const relativePath = path
    .relative(uploadsRoot, filePath)
    .replace(/\\/g, "/");

  return `${req.protocol}://${req.get("host")}/uploads/${relativePath}`;
}

export async function create(req: Request, res: Response) {
  try {
    const body = createPaymentSchema.parse(req.body);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Debes adjuntar una imagen del comprobante.",
      });
    }

    const user = (req as any).user;

    const receipt = {
      receiptUrl: req.file ? buildPublicUrl(req, req.file.path) : undefined,
      receiptName: req.file?.originalname,
      receiptMimeType: req.file?.mimetype,
      receiptSize: req.file?.size,
    };

    const payment = await createPayment(
      user.userId,
      body,
      receipt
    );

    return res.status(201).json({
      success: true,
      message: "Pago enviado correctamente.",
      data: payment,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function myPayments(
  req: Request,
  res: Response
) {
  try {
    const user = (req as any).user;

    const payments = await getMyPayments(user.userId);

    return res.json({
      success: true,
      data: payments,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function all(
  req: Request,
  res: Response
) {
  try {
    const payments = await getPayments();

    return res.json({
      success: true,
      data: payments,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function pending(
  req: Request,
  res: Response
) {
  try {
    const payments = await getPendingPayments();

    return res.json({
      success: true,
      data: payments,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getOne(
  req: Request,
  res: Response
) {
  try {
    const payment = await getPayment(req.params.id);

    return res.json({
      success: true,
      data: payment,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

export async function approve(
  req: Request,
  res: Response
) {
  try {
    const admin = (req as any).user;

    const payment = await approvePayment(
      req.params.id,
      admin.userId
    );

    return res.json({
      success: true,
      message: "Pago aprobado correctamente.",
      data: payment,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function reject(
  req: Request,
  res: Response
) {
  try {
    const admin = (req as any).user;

    const payment = await rejectPayment(
      req.params.id,
      admin.userId
    );

    return res.json({
      success: true,
      message: "Pago rechazado.",
      data: payment,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}