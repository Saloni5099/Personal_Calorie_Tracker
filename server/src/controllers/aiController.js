import { AppError } from "../utils/AppError.js";
import * as aiService from "../services/aiService.js";

export async function analyzeFood(req, res, next) {
  try {
    if (!req.file) {
      throw new AppError(
        "Please upload a valid JPEG, PNG, or WebP image.",
        400,
      );
    }

    const suggestion = await aiService.analyzeFoodImage({
      buffer: req.file.buffer,
      mimeType: req.file.mimetype,
    });

    // Do not persist the image. Multer memory buffer is discarded after response.
    res.status(200).json({
      success: true,
      message: "Image analyzed successfully",
      data: {
        suggestion,
      },
    });
  } catch (error) {
    next(error);
  }
}
