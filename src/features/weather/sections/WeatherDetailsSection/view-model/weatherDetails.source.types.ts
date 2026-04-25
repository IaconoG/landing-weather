import type {
  HourlyForecastItem,
  WeatherDescription,
  WeeklyForecastItem,
  WmoWeatherCode,
} from "../../../../../types/weather.types";

export type WeatherDetailsSectionData = {
  hourly: HourlyForecastItem[] | null;
  weekly: WeeklyForecastItem[] | null;
};

export type WeatherDetailsSourcePoint = {
  timestamp: number;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  visibility: number;
  uv: number;
  windSpeed: number;
  windDirection?: number;
  windGustSpeed?: number;
  dewPoint?: number;
  weatherCode: WmoWeatherCode;
  precipitationProbability?: number;
};

export type WeatherDetailsSourceDay = {
  dateTimestamp: number;
  sunriseTimestamp?: number;
  sunsetTimestamp?: number;
  daylightDurationSeconds?: number;
  moonriseTimestamp?: number;
  moonsetTimestamp?: number;
  moonPhase?: string;
  moonIllumination?: number;
  temperatureMin: number;
  temperatureMax: number;
  weatherCode?: WmoWeatherCode;
  weatherDescription?: WeatherDescription;
  hourly: WeatherDetailsSourcePoint[];
};
