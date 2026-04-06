"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nonGuestMiddleware = exports.adminMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        // Add user info to request object
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
        return;
    }
};
exports.authMiddleware = authMiddleware;
const adminMiddleware = (req, res, next) => {
    const user = req.user;
    if (!user || user.role !== 'ADMIN') {
        res.status(403).json({ error: 'Forbidden: Requires Admin role' });
        return;
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
const nonGuestMiddleware = (req, res, next) => {
    const user = req.user;
    if (!user || user.role === 'GUEST') {
        res.status(403).json({ error: 'Forbidden: Guests cannot perform this action' });
        return;
    }
    next();
};
exports.nonGuestMiddleware = nonGuestMiddleware;
//# sourceMappingURL=auth.js.map