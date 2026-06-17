import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";
import userRepository from "../repository/user.repository";
import { UserRole } from "../model/user.model";
import { TsRestRequestHandler } from "@ts-rest/express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
  name: string;
};

const getTokenFromHeader = (
  authHeader: string | string[] | undefined,
): string | null => {
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

const getCookieToken = (req: any): string | null => {
  if (!req || typeof req !== "object") {
    return null;
  }
  return req.cookies?.token ?? null;
};

export const verifyToken: TsRestRequestHandler<any> = async (
  req,
  res,
  next,
) => {
  try {
    const token = getTokenFromHeader(req.headers.authorization) || getCookieToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Authentication required. Missing token.",
      });
    }

    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    if (!payload?.sub || !payload?.email || !payload?.role) {
      return res.status(401).json({
        success: false,
        error: "Invalid authentication token.",
      });
    }

    const user = await userRepository.getByID(payload.sub);

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
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token.",
    });
  }
};

export const authorizeRoles = (...allowedRoles: UserRole[]): TsRestRequestHandler<any> => (
  req,
  res,
  next,
) => {
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

export const authorizeSelfOrAdmin = (paramName: string): TsRestRequestHandler<any> => (
  req,
  res,
  next,
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Authentication required.",
    });
  }

  const params = req.params as Record<string, string | undefined> | undefined;
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
