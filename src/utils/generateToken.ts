import jwt from "jsonwebtoken";
import { Response } from "express";
import { env } from "../config/env";

interface TokenPayload {
  userId: string;
  email: string;
  role: "user" | "admin";
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie("savorly_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie("savorly_token", { path: "/" });
}
