"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuthHandler = exports.getMe = exports.logout = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../../config/env"));
const user_repository_1 = __importDefault(require("../../repository/user.repository"));
const createToken = (user) => {
    return jsonwebtoken_1.default.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
    }, env_1.default.JWT_SECRET, {
        expiresIn: "8h",
    });
};
const login = async ({ req, res }) => {
    try {
        const { email, password } = req.body;
        const user = await user_repository_1.default.getByEmail(email.toLowerCase(), true);
        if (!user) {
            return {
                status: 401,
                body: {
                    success: false,
                    error: "Invalid email or password.",
                },
            };
        }
        const passwordMatches = await bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatches) {
            return {
                status: 401,
                body: {
                    success: false,
                    error: "Invalid email or password.",
                },
            };
        }
        if (user.status !== "active") {
            return {
                status: 403,
                body: {
                    success: false,
                    error: "Your account is not active.",
                },
            };
        }
        const userId = user._id.toString();
        const token = createToken({
            id: userId,
            email: user.email,
            role: user.role,
            name: user.name,
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 8 * 60 * 60 * 1000,
        });
        return {
            status: 200,
            body: {
                success: true,
                message: "Logged in successfully.",
                user: {
                    _id: userId,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        };
    }
    catch (error) {
        return {
            status: 500,
            body: {
                success: false,
                error: "Failed to login.",
            },
        };
    }
};
exports.login = login;
const logout = async ({ res }) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    return {
        status: 200,
        body: {
            success: true,
            message: "Logged out successfully.",
        },
    };
};
exports.logout = logout;
const getMe = async ({ req }) => {
    if (!req.user) {
        return {
            status: 401,
            body: {
                success: false,
                error: "Not authenticated.",
            },
        };
    }
    const user = await user_repository_1.default.getByID(req.user.id);
    if (!user) {
        return {
            status: 401,
            body: {
                success: false,
                error: "Authenticated user not found.",
            },
        };
    }
    return {
        status: 200,
        body: {
            success: true,
            user: {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                profile: user.profile,
                phone: user.phone,
                status: user.status,
                createdAt: user.createdAt,
            },
        },
    };
};
exports.getMe = getMe;
exports.userAuthHandler = {
    login: exports.login,
    logout: exports.logout,
    getMe: exports.getMe,
};
