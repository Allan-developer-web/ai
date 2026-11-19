import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

export function adminOnly(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Administrator access required",
    });
  }

  next();
}