import { Request, Response, NextFunction } from "express";

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  const message = err instanceof Error ? err.message : "Something went wrong";
  res.status(500).json({ error: message || "Something went wrong. Please try again" });
}

export function notFound(req: Request, res: Response) {
  res.status(404).json({ error: "Route not found" });
}
