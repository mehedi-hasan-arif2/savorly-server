import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateToken, setAuthCookie, clearAuthCookie } from "../utils/generateToken";

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  const token = generateToken({ userId: user._id.toString(), email: user.email, role: user.role });
  setAuthCookie(res, token);

  res.json({ user: { userId: user._id.toString(), name: user.name, email: user.email, role: user.role } });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = generateToken({ userId: user._id.toString(), email: user.email, role: user.role });
  setAuthCookie(res, token);

  res.json({ user: { userId: user._id.toString(), name: user.name, email: user.email, role: user.role } });
}

export function logout(req: Request, res: Response) {
  clearAuthCookie(res);
  res.json({ success: true });
}

export async function me(req: Request, res: Response) {
  if (!req.user) {
    return res.json({ user: null });
  }

  const user = await User.findById(req.user.userId).select("-password");
  if (!user) {
    return res.json({ user: null });
  }

  res.json({ user: { userId: user._id.toString(), name: user.name, email: user.email, role: user.role } });
}
