import { Router } from "express";
import * as aiController from "../controllers/aiController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  handleUploadError,
  uploadFoodImage,
} from "../middleware/uploadMiddleware.js";

const router = Router();

router.use(requireAuth);

router.post(
  "/analyze-food",
  (req, res, next) => {
    uploadFoodImage(req, res, (err) => handleUploadError(err, req, res, next));
  },
  aiController.analyzeFood,
);

export default router;
