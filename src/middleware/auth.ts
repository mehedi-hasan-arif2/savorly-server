import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface TokenPayload {
  userId: string;
  email: string;
  role: "user" | "admin";
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.savorly_token;
  if (!token) {
    return res.status(401).json({ error: "You must be logged in" });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Session expired, please log in again" });
  }
}

// Attaches user if a valid token exists, but never blocks the request
export function attachUserIfPresent(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.savorly_token;
  if (token) {
    try {
      req.user = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    } catch {
      // ignore invalid token for optional auth routes
    }
  }
  next();
}
