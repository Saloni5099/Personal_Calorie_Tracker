import { Router } from "express";
import * as reportController from "../controllers/reportController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);

router.get("/daily", reportController.getDailyReport);
router.get("/weekly", reportController.getWeeklyReport);
router.get("/macros", reportController.getMacrosReport);
router.get("/micros", reportController.getMicrosReport);

export default router;
