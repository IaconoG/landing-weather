import type {
  WeatherDescription,
  WeeklyForecastItem,
  WmoWeatherCode,
} from "../../../../../types/weather.types";

export type WeatherDetailsSectionData = WeeklyForecastItem | null;

type WeatherDetailsSourcePoint = {
  timestamp: number;
  temperature?: number;
  feelsLike?: number;
  humidity?: number;
  pressure?: number;
  visibility?: number;
  uv?: number;
  windSpeed?: number;
  windDirection?: number;
  dewPoint?: number;
  weatherCode?: WmoWeatherCode;
  precipitationProbability?: number;
};

export type WeatherDetailsSource = {
  dateTimestamp: number;
  dateLabel: string;
  sunriseTimestamp?: number;
  sunsetTimestamp?: number;
  daylightDurationSeconds?: number;
  moonriseTimestamp?: number;
  moonsetTimestamp?: number;
  moonPhase?: string;
  moonIllumination?: number;
  temperatureMin?: number;
  temperatureMax?: number;
  weatherCode?: WmoWeatherCode;
  weatherDescription?: WeatherDescription;
  hourly: WeatherDetailsSourcePoint[];
};
