import { validate } from "../utils/validate.js";
import {
  createMealSchema,
  listMealsQuerySchema,
  mealIdParamSchema,
  updateMealSchema,
} from "../validators/mealValidators.js";
import * as mealService from "../services/mealService.js";

export async function createMeal(req, res, next) {
  try {
    const input = validate(createMealSchema, req.body);
    const meal = await mealService.createMeal(req.userId, input);

    res.status(201).json({
      success: true,
      message: "Meal created successfully",
      data: { meal },
    });
  } catch (error) {
    next(error);
  }
}

export async function listMeals(req, res, next) {
  try {
    const query = validate(listMealsQuerySchema, req.query);
    const result = await mealService.listMeals(req.userId, query);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMeal(req, res, next) {
  try {
    const { id } = validate(mealIdParamSchema, req.params);
    const meal = await mealService.getMealById(req.userId, id);

    res.status(200).json({
      success: true,
      data: { meal },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMeal(req, res, next) {
  try {
    const { id } = validate(mealIdParamSchema, req.params);
    const input = validate(updateMealSchema, req.body);
    const meal = await mealService.updateMeal(req.userId, id, input);

    res.status(200).json({
      success: true,
      message: "Meal updated successfully",
      data: { meal },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteMeal(req, res, next) {
  try {
    const { id } = validate(mealIdParamSchema, req.params);
    await mealService.deleteMeal(req.userId, id);

    res.status(200).json({
      success: true,
      message: "Meal deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
