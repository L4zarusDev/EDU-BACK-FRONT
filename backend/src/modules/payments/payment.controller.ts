import { Request, Response } from "express";

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
import { uploadImageBufferToCloudinary } from "../../services/cloudinary.service";

export async function create(req: Request, res: Response) {
  try {
    const body = createPaymentSchema.parse(req.body);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Debes adjuntar una imagen del comprobante.",
      });
    }

    if (!req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: "No se pudo procesar la imagen del comprobante.",
      });
    }

    const user = (req as any).user;

    const uploadedReceipt = await uploadImageBufferToCloudinary(
      req.file.buffer,
      req.file.mimetype,
      "edu-platform/receipts"
    );

    const receipt = {
      receiptUrl: uploadedReceipt.url,
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