/// <reference lib="webworker" />

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
import {
  mapToCurrentWeather,
  mapToHourlyForecast,
  mapToWeeklyForecast,
  mapToMonthlyForecast,
} from "./weather.mapper";
import type { WeatherError } from "../../types/weather.types";
import { getTimeZoneOffsetSeconds } from "./utils";
import {
  FULL_PAST_DAYS,
  type WeatherFetchProfile,
} from "./weather.fetch-profile";

type WorkerRequest = {
  id: number;
  params: {
    latitude: number;
    longitude: number;
    timezone: string;
    profile: WeatherFetchProfile;
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
  hourly?: ReturnType<typeof mapToHourlyForecast>;
  weekly?: ReturnType<typeof mapToWeeklyForecast>;
  monthly?: ReturnType<typeof mapToMonthlyForecast>;
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
    const isFullProfile = params.profile === "full";
    const requestPastDays = isFullProfile ? FULL_PAST_DAYS : 0;

    const response = await fetchWeather({
      latitude: params.latitude,
      longitude: params.longitude,
      timezone: params.timezone,
      hourly: isFullProfile ? HOURLY_FORECAST_PARAMS : CURRENT_HOURLY_PARAMS,
      daily: isFullProfile ? WEEKLY_DAILY_PARAMS : undefined,
      past_days: requestPastDays,
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
      hourly: isFullProfile ? mapToHourlyForecast(response) : undefined,
      weekly: isFullProfile ? mapToWeeklyForecast(response) : undefined,
      monthly: isFullProfile ? mapToMonthlyForecast(response) : undefined,
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
