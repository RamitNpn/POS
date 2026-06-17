"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeSelfOrAdmin = exports.authorizeRoles = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
const user_repository_1 = __importDefault(require("../repository/user.repository"));
const getTokenFromHeader = (authHeader) => {
    if (!authHeader) {
        return null;
    }
    const header = Array.isArray(authHeader) ? authHeader[0] : authHeader;
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
        return null;
    }
    return token;
};
const getCookieToken = (req) => {
    if (!req || typeof req !== "object") {
        return null;
    }
    return req.cookies?.token ?? null;
};
const verifyToken = async (req, res, next) => {
    try {
        const token = getTokenFromHeader(req.headers.authorization) || getCookieToken(req);
        if (!token) {
            return res.status(401).json({
                success: false,
                error: "Authentication required. Missing token.",
            });
        }
        const payload = jsonwebtoken_1.default.verify(token, env_1.default.JWT_SECRET);
        if (!payload?.sub || !payload?.email || !payload?.role) {
            return res.status(401).json({
                success: false,
                error: "Invalid authentication token.",
            });
        }
        const user = await user_repository_1.default.getByID(payload.sub);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: "Authenticated user not found.",
            });
        }
        if (user.status !== "active") {
            return res.status(403).json({
                success: false,
                error: "Your account is not active.",
            });
        }
        req.user = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
        };
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            error: "Invalid or expired token.",
        });
    }
};
exports.verifyToken = verifyToken;
const authorizeRoles = (...allowedRoles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: "Authentication required.",
        });
    }
    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            error: "You do not have permission to perform this action.",
        });
    }
    next();
};
exports.authorizeRoles = authorizeRoles;
const authorizeSelfOrAdmin = (paramName) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: "Authentication required.",
        });
    }
    const params = req.params;
    const targetId = params?.[paramName];
    if (!targetId) {
        return res.status(400).json({
            success: false,
            error: "Missing target identifier for authorization.",
        });
    }
    if (req.user.role === "admin" || req.user.id === targetId) {
        return next();
    }
    return res.status(403).json({
        success: false,
        error: "You are not authorized to access this resource.",
    });
};
exports.authorizeSelfOrAdmin = authorizeSelfOrAdmin;
