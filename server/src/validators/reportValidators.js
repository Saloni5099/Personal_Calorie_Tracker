import { z } from "zod";
import { defaultWeeklyRangeUtc, todayUtcDateString } from "../utils/dates.js";

const ymdDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");

export const dailyReportQuerySchema = z.object({
  date: ymdDate.optional().default(() => todayUtcDateString()),
});

export const rangeReportQuerySchema = z
  .object({
    startDate: ymdDate.optional(),
    endDate: ymdDate.optional(),
  })
  .transform((value) => {
    if (!value.startDate && !value.endDate) {
      return defaultWeeklyRangeUtc();
    }

    if (value.startDate && !value.endDate) {
      return { startDate: value.startDate, endDate: value.startDate };
    }

    if (!value.startDate && value.endDate) {
      return { startDate: value.endDate, endDate: value.endDate };
    }

    return {
      startDate: value.startDate,
      endDate: value.endDate,
    };
  })
  .superRefine((value, ctx) => {
    if (value.startDate > value.endDate) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "startDate cannot be after endDate",
      });
    }
  });
