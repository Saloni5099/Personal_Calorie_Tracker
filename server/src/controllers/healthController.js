import { prisma } from "../lib/prisma.js";

export async function getHealth(_req, res, next) {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: "OK",
      data: {
        service: "calorie-tracker-api",
        database: "connected",
      },
    });
  } catch (error) {
    next(error);
  }
}
