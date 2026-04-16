/// <reference lib="webworker" />

import {
  fetchWeather,
  type FetchError,
  type StructureWeatherData,
} from "@i-giann/open-meteo-wrapper";
import {
  HOURLY_FORECAST_PARAMS,
  WEEKLY_DAILY_PARAMS,
} from "../../constants/weather.query";
import {
  mapToCurrentWeather,
  mapToHourlyForecast,
  mapToMonthlyForecast,
  mapToWeeklyForecast,
} from "./weather.mapper";
import type { WeatherError } from "../../types/weather.types";
import { getTimeZoneOffsetSeconds } from "./utils";

type WorkerRequest = {
  id: number;
  params: {
    latitude: number;
    longitude: number;
    timezone: string;
    forecastDays: number;
  };
};

type WorkerSuccess = {
  id: number;
  ok: true;
  fetchedAt: number;
  timezone: string;
  timezoneOffsetSeconds: number;
  current: ReturnType<typeof mapToCurrentWeather>;
  hourly: ReturnType<typeof mapToHourlyForecast>;
  weekly: ReturnType<typeof mapToWeeklyForecast>;
  monthly: ReturnType<typeof mapToMonthlyForecast>;
};

type WorkerFailure = {
  id: number;
  ok: false;
  fetchedAt: number;
  error: {
    message: string;
    type?: WeatherError["type"];
  };
};

const isWrapperError = (
  response: StructureWeatherData | FetchError,
): response is FetchError => {
  return "errorType" in response;
};

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { id, params } = event.data;
  const fetchedAt = Date.now();

  try {
    const response = await fetchWeather({
      latitude: params.latitude,
      longitude: params.longitude,
      timezone: params.timezone,
      hourly: HOURLY_FORECAST_PARAMS,
      daily: WEEKLY_DAILY_PARAMS,
      past_days: 0,
      forecast_days: params.forecastDays,
    });

    if (isWrapperError(response)) {
      const message: WorkerFailure = {
        id,
        ok: false,
        fetchedAt,
        error: {
          message:
            response.error || "Error al obtener los datos meteorológicos",
          type: response.errorType,
        },
      };

      self.postMessage(message);
      return;
    }

    const message: WorkerSuccess = {
      id,
      ok: true,
      fetchedAt,
      timezone: response.timezone,
      timezoneOffsetSeconds: getTimeZoneOffsetSeconds(
        response.timezone,
        fetchedAt,
      ),
      current: mapToCurrentWeather(response),
      hourly: mapToHourlyForecast(response),
      weekly: mapToWeeklyForecast(response),
      monthly: mapToMonthlyForecast(response),
    };

    self.postMessage(message);
  } catch (error: unknown) {
    const message: WorkerFailure = {
      id,
      ok: false,
      fetchedAt,
      error: {
        message:
          error instanceof Error
            ? error.message
            : "Error inesperado al consultar el clima",
      },
    };

    self.postMessage(message);
  }
};

export {};
