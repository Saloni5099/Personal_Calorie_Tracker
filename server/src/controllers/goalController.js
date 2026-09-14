import { validate } from "../utils/validate.js";
import {
  createGoalSchema,
  updateGoalSchema,
} from "../validators/goalValidators.js";
import * as goalService from "../services/goalService.js";

export async function getGoals(req, res, next) {
  try {
    const goal = await goalService.getGoalForUser(req.userId);

    res.status(200).json({
      success: true,
      data: { goal },
    });
  } catch (error) {
    next(error);
  }
}

export async function createGoals(req, res, next) {
  try {
    const input = validate(createGoalSchema, req.body);
    const goal = await goalService.createGoalForUser(req.userId, input);

    res.status(201).json({
      success: true,
      message: "Goals created successfully",
      data: { goal },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateGoals(req, res, next) {
  try {
    const input = validate(updateGoalSchema, req.body);
    const goal = await goalService.updateGoalForUser(req.userId, input);

    res.status(200).json({
      success: true,
      message: "Goals updated successfully",
      data: { goal },
    });
  } catch (error) {
    next(error);
  }
}
