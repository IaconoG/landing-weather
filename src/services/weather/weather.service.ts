import {
  fetchWeather,
  type FetchError,
  type StructureWeatherData,
} from "@i-giann/open-meteo-wrapper";
import {
  CURRENT_HOURLY_PARAMS,
  HOURLY_FORECAST_PARAMS,
  WEEKLY_DAILY_PARAMS,
} from "../../constants/weather.query";
import type {
  CurrentWeatherResult,
  HourlyForecastResult,
  WeeklyForecastResult,
} from "../../types/weather.types";
import {
  mapToCurrentWeather,
  mapToHourlyForecast,
  mapToWeeklyForecast,
} from "./weather.mapper";
import { getTimeZoneOffsetSeconds } from "./utils";
import {
  HOURLY_FORECAST_TTL_MS,
  WEEKLY_FORECAST_TTL_MS,
} from "../../constants/weather.cache";

export type WeatherLocationParams = {
  latitude: number;
  longitude: number;
  timezone?: string;
};

const isWrapperError = (
  response: StructureWeatherData | FetchError,
): response is FetchError => {
  return "errorType" in response;
};

const buildErrorResult = (
  fetchedAt: number,
  message: string,
  type?: FetchError["errorType"],
) => ({
  data: null,
  error: {
    message,
    type,
    timestamp: new Date(fetchedAt),
  },
  fetchedAt,
});

const buildMeta = (timezone: string, fetchedAt: number) => ({
  timezone,
  timezoneOffsetSeconds: getTimeZoneOffsetSeconds(timezone, fetchedAt),
  fetchedAt,
  expiresAt: fetchedAt + HOURLY_FORECAST_TTL_MS,
});

const buildWeeklyMeta = (timezone: string, fetchedAt: number) => ({
  timezone,
  timezoneOffsetSeconds: getTimeZoneOffsetSeconds(timezone, fetchedAt),
  fetchedAt,
  expiresAt: fetchedAt + WEEKLY_FORECAST_TTL_MS,
});

export class WeatherService {
  getCurrentWeather = async (
    params: WeatherLocationParams,
  ): Promise<CurrentWeatherResult> => {
    const fetchedAt = Date.now();

    try {
      const response = await fetchWeather({
        latitude: params.latitude,
        longitude: params.longitude,
        timezone: params.timezone ?? "auto",
        hourly: CURRENT_HOURLY_PARAMS,
        past_days: 0,
        forecast_days: 1,
      });

      if (isWrapperError(response)) {
        return buildErrorResult(
          fetchedAt,
          response.error || "Error al obtener los datos meteorológicos",
          response.errorType,
        );
      }

      return {
        data: mapToCurrentWeather(response),
        error: null,
        fetchedAt,
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Error inesperado al consultar el clima";

      return buildErrorResult(fetchedAt, message);
    }
  };

  getHourlyForecast = async (
    params: WeatherLocationParams,
  ): Promise<HourlyForecastResult> => {
    const fetchedAt = Date.now();

    try {
      const response = await fetchWeather({
        latitude: params.latitude,
        longitude: params.longitude,
        timezone: params.timezone ?? "auto",
        hourly: HOURLY_FORECAST_PARAMS,
        past_days: 0,
        forecast_days: 2,
      });

      if (isWrapperError(response)) {
        return {
          data: null,
          error: {
            message:
              response.error || "Error al obtener los datos meteorológicos",
            type: response.errorType,
            timestamp: new Date(fetchedAt),
          },
          meta: null,
        };
      }

      return {
        data: mapToHourlyForecast(response),
        error: null,
        meta: buildMeta(response.timezone, fetchedAt),
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Error inesperado al consultar el clima";

      return {
        data: null,
        error: {
          message,
          type: undefined,
          timestamp: new Date(fetchedAt),
        },
        meta: null,
      };
    }
  };

  getWeeklyForecast = async (
    params: WeatherLocationParams,
  ): Promise<WeeklyForecastResult> => {
    const fetchedAt = Date.now();

    try {
      const response = await fetchWeather({
        latitude: params.latitude,
        longitude: params.longitude,
        timezone: params.timezone ?? "auto",
        daily: WEEKLY_DAILY_PARAMS,
        past_days: 0,
        forecast_days: 7,
      });

      if (isWrapperError(response)) {
        return {
          data: null,
          error: {
            message:
              response.error || "Error al obtener los datos meteorológicos",
            type: response.errorType,
            timestamp: new Date(fetchedAt),
          },
          meta: null,
        };
      }

      return {
        data: mapToWeeklyForecast(response),
        error: null,
        meta: buildWeeklyMeta(response.timezone, fetchedAt),
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Error inesperado al consultar el clima";

      return {
        data: null,
        error: {
          message,
          type: undefined,
          timestamp: new Date(fetchedAt),
        },
        meta: null,
      };
    }
  };
}

export const weatherService = new WeatherService();
