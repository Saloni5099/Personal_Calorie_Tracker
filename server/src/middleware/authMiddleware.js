import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

export function requireAuth(req, _res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError("Authentication required", 401));
  }

  const token = header.slice("Bearer ".length).trim();

  if (!token) {
    return next(new AppError("Authentication required", 401));
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const userId = Number(payload.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
      return next(new AppError("Invalid or expired token", 401));
    }

    req.userId = userId;
    return next();
  } catch {
    return next(new AppError("Invalid or expired token", 401));
  }
}
