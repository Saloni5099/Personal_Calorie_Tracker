import { Router } from "express";
import * as goalController from "../controllers/goalController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", goalController.getGoals);
router.post("/", goalController.createGoals);
router.put("/", goalController.updateGoals);

export default router;
