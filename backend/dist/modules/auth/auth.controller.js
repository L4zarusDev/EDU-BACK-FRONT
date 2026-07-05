"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const auth_validation_1 = require("./auth.validation");
const auth_service_1 = require("./auth.service");
const auth_service_2 = require("./auth.service");
const auth_validation_2 = require("./auth.validation");
async function register(req, res) {
    try {
        const data = auth_validation_1.registerSchema.parse(req.body);
        const user = await (0, auth_service_1.registerUser)(data);
        return res.status(201).json(user);
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({
            message: "No fue posible registrar el usuario.",
        });
    }
}
async function login(req, res) {
    try {
        const data = auth_validation_2.loginSchema.parse(req.body);
        const result = await (0, auth_service_2.loginUser)(data);
        return res.json(result);
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({
            message: "Error al iniciar sesión",
        });
    }
}
