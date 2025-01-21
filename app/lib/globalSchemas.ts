import { z } from "zod";

import {
  getTimeRangeDefaults,
  possibleInstanceTimeSeriesMetrics,
} from "~/constants";

export const instancesFilterSchema = z.object({
  id: z.string().optional(),
  updatedWithinHours: z.number().optional(),
  chargingBehaviour: z
      .enum(["daily", "multiplePerWeek", "weekly", "rarely"])
      .array()
      .optional(),
    pvPower: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
    }).optional(),
    wallboxPower: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
    }).optional(),
  })
  .partial();


export const instanceIdsFilterSchema = z.object({
  instanceIds: z.array(z.string()).optional(),
});

export const timeRangeSchema = z.object({
  start: z.number(),
  end: z.number(),
  windowMinutes: z.number(),
});

export const timeRangeInputSchema = z.object({
  timeRange: timeRangeSchema
    .partial()
    .extend({
      start: z.number().default(getTimeRangeDefaults().start),
      end: z.number().default(getTimeRangeDefaults().end),
      windowMinutes: z.number().default(getTimeRangeDefaults().windowMinutes),
    })
    .default({})
    .transform((data) => ({
      start: new Date(data.start),
      end: new Date(data.end),
      windowMinutes: data.windowMinutes,
    })),
});

export const timeRangeUrlSchema = timeRangeSchema.partial().default({});
export type UrlTimeRange = z.infer<typeof timeRangeUrlSchema>;

export type TimeSeriesData<TValue extends number | string | boolean | null> = {
  value: TValue;
  timeStamp: number;
};

export type WindowedTimeSeriesData<
  TValue extends number | string | boolean | null,
> = TimeSeriesData<TValue> & {
  startTimeStamp: number;
  endTimeStamp: number;
};

export const singleInstanceRouteSearchSchema = z.object({
  expandedKey: z.string().optional(),
  timeSeriesMetric: z
    .enum(possibleInstanceTimeSeriesMetrics)
    .default("batterySoc"),
  timeRange: timeRangeUrlSchema,
});
