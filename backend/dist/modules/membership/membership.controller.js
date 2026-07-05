"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = me;
exports.all = all;
exports.getOne = getOne;
const membership_service_1 = require("./membership.service");
/*
|--------------------------------------------------------------------------
| Mi membresía
|--------------------------------------------------------------------------
*/
async function me(req, res) {
    try {
        const user = req.user;
        const membership = await (0, membership_service_1.getMyMembership)(user.userId);
        return res.json({
            success: true,
            data: membership,
        });
    }
    catch (error) {
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
async function all(req, res) {
    try {
        const memberships = await (0, membership_service_1.getMemberships)();
        return res.json({
            success: true,
            data: memberships,
        });
    }
    catch (error) {
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
async function getOne(req, res) {
    try {
        const membership = await (0, membership_service_1.getMembership)(req.params.userId);
        return res.json({
            success: true,
            data: membership,
        });
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }
}
