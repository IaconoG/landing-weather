import type { ErrorType } from "@i-giann/open-meteo-wrapper";

/**
 * Current weather snapshot used by the main card.
 */
export type CurrentWeather = {
  temperature: number; // °C
  feelsLike: number; // °C
  humidity: number; // %
  weatherDescription: string;
  windSpeed: number; // km/h
  pressure: number; // hPa
  visibility: number; // km
  uv: number; // UV index
  timestamp: number; // epoch ms
};

/**
 * Shared fetch state.
 */
export type WeatherState = "idle" | "loading" | "success" | "error";

/**
 * Standard UI error shape.
 */
export type WeatherError = {
  message: string;
  type?: ErrorType;
  timestamp: Date;
};

/**
 * Map of weather codes to descriptions
 */
export type WeatherCodeMap = {
  [key: number]: string;
};

/**
 * Result of fetching current weather, including data, error and metadata.
 */
export type CurrentWeatherResult = {
  data: CurrentWeather | null;
  error: WeatherError | null;
  fetchedAt: number;
};

/**
 * Shared metadata for forecast blocks.
 */
export type ForecastMeta = {
  timezone: string;
  timezoneOffsetSeconds: number;
  fetchedAt: number;
  expiresAt: number;
};

type ForecastPointBase = {
  timestamp: number; // epoch ms normalized to the weather timezone
};

/**
 * Item shape for hourly forecast data.
 */
export type HourlyForecastItem = ForecastPointBase & {
  temperature: number;
  feelsLike: number;
  humidity: number;
  weatherCode: number;
  weatherDescription: string;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uv: number;
  isDay?: boolean;
  precipitationProbability?: number;
  cloudCover?: number;
};

/**
 * Result of fetching hourly forecast, including data, error and metadata.
 */
export type HourlyForecastResult = {
  data: HourlyForecastItem[] | null;
  error: WeatherError | null;
  meta: ForecastMeta | null;
};

/**
 * Item shape for daily forecast data.
 */
export type WeeklyForecastItem = {
  dateTimestamp: number; // start of day in epoch ms
  minTemperature: number;
  maxTemperature: number;
  weatherCode?: number;
  weatherDescription?: string;
  sunriseTimestamp?: number;
  sunsetTimestamp?: number;
  daylightDurationSeconds?: number;
  precipitationProbability?: number;
};

/**
 * Result of fetching weekly forecast, including data, error and metadata.
 */
export type WeeklyForecastResult = {
  data: WeeklyForecastItem[] | null;
  error: WeatherError | null;
  meta: ForecastMeta | null;
};

/**
 * Item shape for monthly forecast data.
 */
export type MonthlyForecastItem = {
  dateTimestamp: number; // start of month in epoch ms
  minTemperature: number;
  maxTemperature: number;
  weatherCode?: number;
  weatherDescription?: string;
};

/**
 * Result of fetching monthly forecast, including data, error and metadata.
 */
export type MonthlyForecastResult = {
  data: MonthlyForecastItem[] | null;
  error: WeatherError | null;
  meta: ForecastMeta | null;
};
