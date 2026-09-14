import { validate } from "../utils/validate.js";
import { loginSchema, registerSchema } from "../validators/authValidators.js";
import * as authService from "../services/authService.js";

export async function register(req, res, next) {
  try {
    const input = validate(registerSchema, req.body);
    const result = await authService.registerUser(input);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const input = validate(loginSchema, req.body);
    const result = await authService.loginUser(input);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    const user = await authService.getUserById(req.userId);

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}
