import type {
  ErrorType,
  WeatherDescriptions,
} from "@i-giann/open-meteo-wrapper";

export type WmoWeatherCode =
  | 0
  | 1
  | 2
  | 3
  | 45
  | 48
  | 51
  | 53
  | 55
  | 56
  | 57
  | 61
  | 63
  | 65
  | 66
  | 67
  | 71
  | 73
  | 75
  | 77
  | 80
  | 81
  | 82
  | 85
  | 86
  | 95;

export type WeatherDescription =
  | `${WeatherDescriptions}`
  | "Condicion desconocida";

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

//** MAP OF WEATHER CODES TO DESCRIPTIONS *//
export type WeatherCodeMap = {
  [key in WmoWeatherCode]?: WeatherDescription;
};

//** SHARED FORECAST METADATA *//
export type ForecastMeta = {
  timezone: string;
  timezoneOffsetSeconds: number;
  fetchedAt: number;
  expiresAt: number;
};

type ForecastPointBase = {
  timestamp: number; // epoch ms normalized to the weather timezone
};

// ** CURRENT WEATHER TYPES *//

/* Current weather snapshot used by the main card. */
export type CurrentWeather = {
  temperature: number; // °C
  feelsLike: number; // °C
  humidity: number; // %
  weatherDescription: WeatherDescription;
  windSpeed: number; // km/h
  pressure: number; // hPa
  visibility: number; // km
  uv: number; // UV index
  timestamp: number; // epoch ms
};

/* Result of fetching current weather, including data, error and metadata. */
export type CurrentWeatherResult = {
  data: CurrentWeather | null;
  error: WeatherError | null;
  fetchedAt: number;
};

//** HOURLY FORECAST TYPES *//

/* Item shape for hourly forecast data. */
export type HourlyForecastItem = ForecastPointBase & {
  temperature: number;
  feelsLike: number;
  humidity: number;
  weatherCode: WmoWeatherCode;
  weatherDescription: WeatherDescription;
  windSpeed: number;
  windDirection?: number;
  windGustSpeed?: number;
  dewPoint?: number;
  pressure: number;
  visibility: number;
  uv: number;
  isDay?: boolean;
  precipitationProbability?: number;
  cloudCover?: number;
};

/* Result of fetching hourly forecast, including data, error and metadata. */
export type HourlyForecastResult = {
  data: HourlyForecastItem[] | null;
  error: WeatherError | null;
  meta: ForecastMeta | null;
};

//** WEEKLY FORECAST TYPES *//

/* Item shape for daily forecast data. */
export type WeeklyForecastItem = {
  dateTimestamp: number; // start of day in epoch ms
  minTemperature: number;
  maxTemperature: number;
  weatherCode?: WmoWeatherCode;
  weatherDescription?: WeatherDescription;
  sunriseTimestamp?: number;
  sunsetTimestamp?: number;
  daylightDurationSeconds?: number;
  precipitationProbability?: number;
};

/* Result of fetching weekly forecast, including data, error and metadata. */
export type WeeklyForecastResult = {
  data: WeeklyForecastItem[] | null;
  error: WeatherError | null;
  meta: ForecastMeta | null;
};

//** MONTHLY FORECAST TYPES *//

/* Item shape for monthly forecast data. */
export type MonthlyForecastItem = {
  dateTimestamp: number; // start of month in epoch ms
  minTemperature: number;
  maxTemperature: number;
  weatherCode?: WmoWeatherCode;
  weatherDescription?: WeatherDescription;
  weatherIconUrl?: string;
};

/* Result of fetching monthly forecast, including data, error and metadata. */
export type MonthlyForecastResult = {
  data: MonthlyForecastItem[] | null;
  error: WeatherError | null;
  meta: ForecastMeta | null;
};
