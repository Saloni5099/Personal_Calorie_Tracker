import multer from "multer";
import { AppError } from "../utils/AppError.js";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_IMAGE_BYTES,
    files: 1,
  },
  fileFilter(_req, file, cb) {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(
        new AppError(
          "Please upload a valid JPEG, PNG, or WebP image.",
          400,
        ),
      );
      return;
    }
    cb(null, true);
  },
});

export const uploadFoodImage = upload.single("image");

export function handleUploadError(err, _req, _res, next) {
  if (!err) {
    next();
    return;
  }

  if (err instanceof AppError) {
    next(err);
    return;
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      next(
        new AppError(
          "Image is too large. Please upload an image under 5 MB.",
          400,
        ),
      );
      return;
    }

    next(new AppError("Invalid image upload. Please try again.", 400));
    return;
  }

  next(err);
}
