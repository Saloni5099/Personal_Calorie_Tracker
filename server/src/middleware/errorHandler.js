import { env } from "../config/env.js";

export function notFoundHandler(_req, res) {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
}

export function errorHandler(err, _req, res, _next) {
  // Prisma unique constraint (duplicate email, duplicate goals, etc.)
  if (err?.code === "P2002") {
    const target = err.meta?.target;
    const fields = Array.isArray(target) ? target : [target].filter(Boolean);
    const message = fields.includes("email")
      ? "Email is already registered"
      : fields.includes("userId")
        ? "Goals already exist. Use PUT /api/goals to update them."
        : "Resource already exists";

    return res.status(409).json({
      success: false,
      message,
    });
  }

  const status = err.statusCode ?? err.status ?? 500;
  const message =
    status === 500 && env.isProd
      ? "Internal server error"
      : err.message || "Internal server error";

  if (!env.isProd && status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    success: false,
    message,
    ...(err.errors ? { errors: err.errors } : {}),
  });
}
