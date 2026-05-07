import {
  type WeatherValue,
  type UVData,
  type WindData,
  type UvRiskLevels,
} from "@i-giann/open-meteo-wrapper";
import type {
  CurrentWeather,
  HourlyForecastItem,
  WeeklyForecastItem,
  MonthlyForecastItem,
  WeatherValueUI,
  UVDataUI,
  WindDataUI,
} from "../../types/weather.types";
import { toNumber } from "./utils";

const UNKNOWN_UV_RISK_LEVEL = "unknown" as UvRiskLevels;

/** Format number with unit to WeatherValueUI with label */
export const makeValueUI = (
  value: number | undefined,
  unit: string,
): WeatherValueUI => {
  const displayValue = value !== undefined ? `${value} ${unit}` : `-- ${unit}`;
  return {
    value,
    unit,
    label: displayValue,
  };
};

/** Convert WeatherValue (with unit) to WeatherValueUI (with formatted label) */
export const formatWeatherValue = (
  weatherValue?: WeatherValue,
): WeatherValueUI => {
  const value = toNumber(weatherValue?.value ?? 0);
  const unit = weatherValue?.unit ?? "";

  return makeValueUI(value, unit);
};

/** Convert UVData to UVDataUI with formatted label */
export const formatWeatherUVValue = (uvData: UVData | undefined): UVDataUI => {
  const value = toNumber(uvData?.value ?? 0);
  const riskLevel = uvData?.riskLevel ?? UNKNOWN_UV_RISK_LEVEL;
  const description = uvData?.description ?? "Condicion desconocida";
  const unit = "UVI";

  return {
    value,
    riskLevel,
    description,
    unit: unit,
    label: `${value} ${unit} (Riesgo: ${riskLevel}): ${description}`,
  };
};

/** Convert WindData to WindDataUI with formatted labels */
export const formatWeatherWind = (
  windData: WindData | undefined,
): WindDataUI => {
  const speedValue = toNumber(windData?.speed.value ?? 0);
  const speedUnit = windData?.speed.unit ?? "km/h";
  const directionValue = toNumber(windData?.direction?.value ?? 0);
  const directionUnit = windData?.direction?.unit ?? "°";

  return {
    speed: {
      value: speedValue,
      unit: speedUnit,
      label: `${speedValue} ${speedUnit}`,
    },
    direction: windData?.direction
      ? {
          value: directionValue,
          unit: directionUnit,
          label: `${directionValue} ${directionUnit}`,
        }
      : undefined,
  };
};

/** Default values for weather data when missing, to avoid nulls in the UI */
const WEATHER_VALUE_DEFAULT: WeatherValueUI = makeValueUI(undefined, "°C");

/** Base default values for weather items, to be extended for current, hourly and daily forecasts */
const DEFUALT_WEATHER_BASE = {
  timestamp: Date.now(),
  temperature: WEATHER_VALUE_DEFAULT,
  feelsLike: WEATHER_VALUE_DEFAULT,
  humidity: {
    ...WEATHER_VALUE_DEFAULT,
    unit: "%",
  },
  weatherDescription: "Condicion desconocida",
  wind: {
    speed: {
      ...WEATHER_VALUE_DEFAULT,
      unit: "km/h",
    },
    direction: {
      ...WEATHER_VALUE_DEFAULT,
      unit: "°",
    },
  },
  pressure: {
    ...WEATHER_VALUE_DEFAULT,
    unit: "hPa",
  },

  visibility: {
    ...WEATHER_VALUE_DEFAULT,
    unit: "m",
  },
  uv: {
    value: 0,
    riskLevel: UNKNOWN_UV_RISK_LEVEL,
    description: "Condicion desconocida",
    unit: "UVI",
  },
};

/** Default for current weather when data is missing */
export const DEFAULT_CURRENT_WEATHER: CurrentWeather = {
  ...(DEFUALT_WEATHER_BASE as CurrentWeather),
};

/** Default for hourly item when data is missing */
export const DEFAULT_HOURLY_FORECAST_ITEM: HourlyForecastItem = {
  ...(DEFUALT_WEATHER_BASE as HourlyForecastItem),
  dewPoint: { ...WEATHER_VALUE_DEFAULT },
  precipitationProbability: {
    ...WEATHER_VALUE_DEFAULT,
    unit: "%",
  },
  precipitation: {
    ...WEATHER_VALUE_DEFAULT,
    unit: "mm",
  },
  rain: {
    ...WEATHER_VALUE_DEFAULT,
    unit: "mm",
  },
  snowfall: {
    ...WEATHER_VALUE_DEFAULT,
    unit: "cm",
  },
  snowDepth: {
    ...WEATHER_VALUE_DEFAULT,
    unit: "cm",
  },
  isDay: false,
  cloudCover: {
    ...WEATHER_VALUE_DEFAULT,
    unit: "%",
  },
};

/** Default for weekly item when data is missing */
export const DEFAULT_WEEKLY_FORECAST_ITEM: WeeklyForecastItem = {
  dateTimestamp: Date.now(),
  dateLabel: "--",
  hourly: [],
  aggregates: {
    minTemperature: { ...WEATHER_VALUE_DEFAULT },
    maxTemperature: { ...WEATHER_VALUE_DEFAULT },
    minFeelsLike: { ...WEATHER_VALUE_DEFAULT },
    maxFeelsLike: { ...WEATHER_VALUE_DEFAULT },
    minHumidity: { ...WEATHER_VALUE_DEFAULT, unit: "%" },
    maxHumidity: { ...WEATHER_VALUE_DEFAULT, unit: "%" },
    minDewPoint: { ...WEATHER_VALUE_DEFAULT },
    maxDewPoint: { ...WEATHER_VALUE_DEFAULT },
    maxPrecipitationProbability: { ...WEATHER_VALUE_DEFAULT, unit: "%" },
    totalPrecipitation: { ...WEATHER_VALUE_DEFAULT, unit: "mm" },
    totalRain: { ...WEATHER_VALUE_DEFAULT, unit: "mm" },
    totalSnowfall: { ...WEATHER_VALUE_DEFAULT, unit: "cm" },
    maxSnowDepth: { ...WEATHER_VALUE_DEFAULT, unit: "cm" },
    sunriseTimestamp: undefined,
    sunsetTimestamp: undefined,
    daylightDurationSeconds: undefined,
    avgWindSpeed: { ...WEATHER_VALUE_DEFAULT, unit: "km/h" },
    avgVisibility: { ...WEATHER_VALUE_DEFAULT, unit: "m" },
    maxUv: { ...WEATHER_VALUE_DEFAULT, unit: "UVI" },
  },
};

/** Default for monthly item when data is missing */
export const DEFAULT_MONTHLY_FORECAST_ITEM: MonthlyForecastItem = {
  dateTimestamp: Date.now(),
  minTemperature: { ...WEATHER_VALUE_DEFAULT },
  maxTemperature: { ...WEATHER_VALUE_DEFAULT },
  maxPrecipitationProbability: { ...WEATHER_VALUE_DEFAULT, unit: "%" },
  maxWindSpeed: { ...WEATHER_VALUE_DEFAULT, unit: "km/h" },
  maxWindDirection: { ...WEATHER_VALUE_DEFAULT, unit: "°" },
  maxHumidity: { ...WEATHER_VALUE_DEFAULT, unit: "%" },
  weatherCode: undefined,
  weatherDescription: "Condicion desconocida",
};

/** Empty arrays to use as default when forecast data is missing, eviting nulls in the UI */
export const EMPTY_HOURLY_FORECAST: HourlyForecastItem[] = [];
export const EMPTY_WEEKLY_FORECAST: WeeklyForecastItem[] = [];
export const EMPTY_MONTHLY_FORECAST: MonthlyForecastItem[] = [];

/* Constants and utils for weather data mapping */
export const DAY_LABEL_FORMATTER = new Intl.DateTimeFormat("es-AR", {
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
});

/* Compute min, max and avg values from an array of numbers, handling undefined and empty arrays */
export const computeMin = (values: number[] | undefined) =>
  values && values.length > 0 ? Math.min(...values) : undefined;
export const computeMax = (values: number[] | undefined) =>
  values && values.length > 0 ? Math.max(...values) : undefined;
export const computeAvg = (values: number[] | undefined) =>
  values && values.length > 0
    ? values.reduce((sum, item) => sum + item, 0) / values.length
    : undefined;
