import { Router } from "express";
import * as mealController from "../controllers/mealController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);

router.post("/", mealController.createMeal);
router.get("/", mealController.listMeals);
router.get("/:id", mealController.getMeal);
router.put("/:id", mealController.updateMeal);
router.delete("/:id", mealController.deleteMeal);

export default router;
