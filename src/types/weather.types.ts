import type {
  ErrorType,
  WeatherDescriptions,
  UvRiskLevels,
} from "@i-giann/open-meteo-wrapper";

/* WMO codes and descriptions */
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

//** MAP OF WEATHER CODES TO DESCRIPTIONS *//
export type WeatherCodeMap = {
  [key in WmoWeatherCode]?: WeatherDescription;
};

/* State |  errors | metadata types */
export type WeatherState = "idle" | "loading" | "success" | "error";

/* Standard UI error shape. */
export type WeatherError = {
  message: string;
  type?: ErrorType;
  timestamp: Date;
};

//** SHARED FORECAST METADATA *//
export type ForecastMeta = {
  timezone: string;
  timezoneOffsetSeconds: number;
  fetchedAt: number;
  expiresAt: number;
};

export interface WeatherValueUI {
  value: number | undefined;
  unit?: string;
  label: string;
}
export interface DateValueUI {
  value: Date;
  unit?: string;
  label: string;
}
export interface TextValueUI {
  value: string;
  unit?: string;
  label: string;
}
export interface WindDataUI {
  speed: WeatherValueUI;
  direction?: WeatherValueUI;
}
export interface UVDataUI {
  value: number | undefined;
  riskLevel: UvRiskLevels;
  description: string;
  unit: string;
  label: string;
}

/* Current weather (principal section) */
export type CurrentWeather = {
  temperature: WeatherValueUI;
  feelsLike: WeatherValueUI;
  humidity: WeatherValueUI;
  precipitationProbability: WeatherValueUI;
  weatherCode?: WmoWeatherCode;
  weatherDescription: WeatherDescription;
  wind: WindDataUI;
  pressure: WeatherValueUI;
  visibility: WeatherValueUI;
  uv: UVDataUI;
  timestamp: number;
};

export type CurrentWeatherResult = {
  data: CurrentWeather | null;
  error: WeatherError | null;
  fetchedAt: number;
};

/* Hourly forecast item (normalizado para la app) */
export type HourlyForecastItem = {
  timestamp: number; // epoch ms (timezone normalizado)
  temperature: WeatherValueUI;
  humidity: WeatherValueUI;
  dewPoint: WeatherValueUI;
  feelsLike: WeatherValueUI;
  precipitationProbability: WeatherValueUI;
  precipitation: WeatherValueUI;
  rain: WeatherValueUI;
  snowfall: WeatherValueUI;
  snowDepth: WeatherValueUI;
  weatherCode?: WmoWeatherCode;
  weatherDescription: WeatherDescription;
  wind: WindDataUI;
  pressure: WeatherValueUI;
  visibility: WeatherValueUI;
  uv: UVDataUI;
  isDay: boolean;
  cloudCover: WeatherValueUI;
};

export type HourlyForecastResult = {
  data: HourlyForecastItem[] | null;
  error: WeatherError | null;
  meta: ForecastMeta | null;
};

/* Weekly day forecast item */
export type WeeklyForecastItem = {
  dateTimestamp: number; // start of day epoch ms
  dateLabel: string;
  hourly: HourlyForecastItem[];
  aggregates: {
    minTemperature: WeatherValueUI;
    maxTemperature: WeatherValueUI;
    minFeelsLike: WeatherValueUI;
    maxFeelsLike: WeatherValueUI;
    minHumidity: WeatherValueUI;
    maxHumidity: WeatherValueUI;
    minDewPoint: WeatherValueUI;
    maxDewPoint: WeatherValueUI;
    maxPrecipitationProbability: WeatherValueUI;
    totalPrecipitation: WeatherValueUI;
    totalRain: WeatherValueUI;
    totalSnowfall: WeatherValueUI;
    maxSnowDepth: WeatherValueUI;
    sunriseTimestamp?: number;
    sunsetTimestamp?: number;
    daylightDurationSeconds?: number;
    avgWindSpeed: WeatherValueUI;
    avgVisibility: WeatherValueUI;
    maxUv: WeatherValueUI;
  };
};

export type WeeklyForecastResult = {
  data: WeeklyForecastItem[] | null;
  error: WeatherError | null;
  meta: ForecastMeta | null;
};

/* Monthly forecast item */
export type MonthlyForecastItem = {
  dateTimestamp: number;
  minTemperature: WeatherValueUI;
  maxTemperature: WeatherValueUI;
  maxPrecipitationProbability: WeatherValueUI;
  maxWindSpeed: WeatherValueUI;
  maxHumidity: WeatherValueUI;
  weatherCode?: WmoWeatherCode;
  weatherDescription: WeatherDescription;
};

export type MonthlyForecastResult = {
  data: MonthlyForecastItem[] | null;
  error: WeatherError | null;
  meta: ForecastMeta | null;
};
