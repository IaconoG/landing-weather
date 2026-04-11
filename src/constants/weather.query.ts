import { DailyParams, HourlyParams } from "@i-giann/open-meteo-wrapper";

export const CURRENT_HOURLY_PARAMS: HourlyParams[] = [
  HourlyParams.Temperature,
  HourlyParams.ApparentTemperature,
  HourlyParams.RelativeHumidity,
  HourlyParams.WeatherCode,
  HourlyParams.WindSpeed,
  HourlyParams.PressureMsl,
  HourlyParams.Visibility,
  HourlyParams.UvIndex,
];

export const HOURLY_FORECAST_PARAMS: HourlyParams[] = [
  HourlyParams.Temperature,
  HourlyParams.ApparentTemperature,
  HourlyParams.RelativeHumidity,
  HourlyParams.WeatherCode,
  HourlyParams.WindSpeed,
  HourlyParams.PressureMsl,
  HourlyParams.Visibility,
  HourlyParams.UvIndex,
  HourlyParams.IsDay,
  HourlyParams.PrecipitationProbability,
  HourlyParams.CloudCover,
];

export const WEEKLY_DAILY_PARAMS: DailyParams[] = [
  DailyParams.TemperatureMax,
  DailyParams.TemperatureMin,
  DailyParams.Sunrise,
  DailyParams.Sunset,
  DailyParams.DaylightDuration,
];

/**
 * Unions derivadas de listas concretas (útiles para mappers/validaciones)
 */
export type HourlyForecastParam = (typeof HOURLY_FORECAST_PARAMS)[number];
export type WeeklyDailyParam = (typeof WEEKLY_DAILY_PARAMS)[number];