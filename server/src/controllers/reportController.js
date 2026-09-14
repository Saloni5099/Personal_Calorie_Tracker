import { validate } from "../utils/validate.js";
import {
  dailyReportQuerySchema,
  rangeReportQuerySchema,
} from "../validators/reportValidators.js";
import * as reportService from "../services/reportService.js";

export async function getDailyReport(req, res, next) {
  try {
    const { date } = validate(dailyReportQuerySchema, req.query);
    const report = await reportService.getDailyReport(req.userId, date);

    res.status(200).json({
      success: true,
      data: { report },
    });
  } catch (error) {
    next(error);
  }
}

export async function getWeeklyReport(req, res, next) {
  try {
    const { startDate, endDate } = validate(rangeReportQuerySchema, req.query);
    const report = await reportService.getWeeklyReport(
      req.userId,
      startDate,
      endDate,
    );

    res.status(200).json({
      success: true,
      data: { report },
    });
  } catch (error) {
    next(error);
  }
}

export async function getMacrosReport(req, res, next) {
  try {
    const { startDate, endDate } = validate(rangeReportQuerySchema, req.query);
    const report = await reportService.getMacrosReport(
      req.userId,
      startDate,
      endDate,
    );

    res.status(200).json({
      success: true,
      data: { report },
    });
  } catch (error) {
    next(error);
  }
}

export async function getMicrosReport(req, res, next) {
  try {
    const { startDate, endDate } = validate(rangeReportQuerySchema, req.query);
    const report = await reportService.getMicrosReport(
      req.userId,
      startDate,
      endDate,
    );

    res.status(200).json({
      success: true,
      data: { report },
    });
  } catch (error) {
    next(error);
  }
}
