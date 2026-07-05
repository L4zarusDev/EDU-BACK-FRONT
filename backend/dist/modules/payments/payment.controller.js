"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.myPayments = myPayments;
exports.all = all;
exports.pending = pending;
exports.getOne = getOne;
exports.approve = approve;
exports.reject = reject;
const payment_service_1 = require("./payment.service");
const payment_validation_1 = require("./payment.validation");
const cloudinary_service_1 = require("../../services/cloudinary.service");
async function create(req, res) {
    try {
        const body = payment_validation_1.createPaymentSchema.parse(req.body);
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
        const user = req.user;
        const uploadedReceipt = await (0, cloudinary_service_1.uploadImageBufferToCloudinary)(req.file.buffer, req.file.mimetype, "edu-platform/receipts");
        const receipt = {
            receiptUrl: uploadedReceipt.url,
            receiptName: req.file?.originalname,
            receiptMimeType: req.file?.mimetype,
            receiptSize: req.file?.size,
        };
        const payment = await (0, payment_service_1.createPayment)(user.userId, body, receipt);
        return res.status(201).json({
            success: true,
            message: "Pago enviado correctamente.",
            data: payment,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}
async function myPayments(req, res) {
    try {
        const user = req.user;
        const payments = await (0, payment_service_1.getMyPayments)(user.userId);
        return res.json({
            success: true,
            data: payments,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}
async function all(req, res) {
    try {
        const payments = await (0, payment_service_1.getPayments)();
        return res.json({
            success: true,
            data: payments,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
async function pending(req, res) {
    try {
        const payments = await (0, payment_service_1.getPendingPayments)();
        return res.json({
            success: true,
            data: payments,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
async function getOne(req, res) {
    try {
        const payment = await (0, payment_service_1.getPayment)(req.params.id);
        return res.json({
            success: true,
            data: payment,
        });
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
}
async function approve(req, res) {
    try {
        const admin = req.user;
        const payment = await (0, payment_service_1.approvePayment)(req.params.id, admin.userId);
        return res.json({
            success: true,
            message: "Pago aprobado correctamente.",
            data: payment,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}
async function reject(req, res) {
    try {
        const admin = req.user;
        const payment = await (0, payment_service_1.rejectPayment)(req.params.id, admin.userId);
        return res.json({
            success: true,
            message: "Pago rechazado.",
            data: payment,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}
