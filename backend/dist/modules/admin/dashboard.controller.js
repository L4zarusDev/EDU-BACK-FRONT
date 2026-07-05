"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboard = dashboard;
const dashboard_service_1 = require("./dashboard.service");
async function dashboard(req, res) {
    try {
        const data = await (0, dashboard_service_1.getDashboard)();
        return res.json(data);
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}
