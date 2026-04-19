import type {
  CurrentWeather,
  CurrentWeatherResult,
  HourlyForecastItem,
  HourlyForecastResult,
  MonthlyForecastItem,
  MonthlyForecastResult,
  WeatherError,
  WeeklyForecastItem,
  WeeklyForecastResult,
} from "../../types/weather.types";
import {
  HOURLY_FORECAST_TTL_MS,
  WEEKLY_FORECAST_TTL_MS,
  MONTHLY_FORECAST_TTL_MS,
} from "../../constants/weather.cache";
import {
  CURRENT_FORRECAST_DAYS,
  FULL_FORECAST_DAYS,
  type WeatherFetchProfile,
} from "./weather.fetch-profile";

export type WeatherLocationParams = {
  latitude: number;
  longitude: number;
  timezone?: string;
};

type SharedWeatherFetchResult = {
  fetchedAt: number;
  ok: boolean;
  timezone?: string;
  timezoneOffsetSeconds?: number;
  current?: CurrentWeather;
  hourly?: HourlyForecastItem[];
  weekly?: WeeklyForecastItem[];
  monthly?: MonthlyForecastItem[];
  error?: {
    message: string;
    type?: WeatherError["type"];
  };
};

const SHARED_RESPONSE_TTL_MS = 15_000;

type WorkerRequestPayload = {
  id: number;
  params: {
    latitude: number;
    longitude: number;
    timezone: string;
    profile: WeatherFetchProfile;
    forecastDays: number;
  };
};

type WorkerSuccessPayload = {
  id: number;
  ok: true;
  fetchedAt: number;
  timezone: string;
  timezoneOffsetSeconds: number;
  current: CurrentWeather;
  hourly?: HourlyForecastItem[];
  weekly?: WeeklyForecastItem[];
  monthly?: MonthlyForecastItem[];
};

type WorkerFailurePayload = {
  id: number;
  ok: false;
  fetchedAt: number;
  error: {
    message: string;
    type?: WeatherError["type"];
  };
};

type WorkerResponsePayload = WorkerSuccessPayload | WorkerFailurePayload;

let workerRequestId = 0;
const weatherWorker = new Worker(
  new URL("./weather.worker.ts", import.meta.url),
  { type: "module" },
);

const pendingWorkerRequests = new Map<
  number,
  {
    resolve: (value: SharedWeatherFetchResult) => void;
    reject: (reason?: unknown) => void;
  }
>();

weatherWorker.onmessage = (event: MessageEvent<WorkerResponsePayload>) => {
  const message = event.data;
  const pending = pendingWorkerRequests.get(message.id);
  if (!pending) return;

  pendingWorkerRequests.delete(message.id);

  if (message.ok) {
    pending.resolve({
      fetchedAt: message.fetchedAt,
      ok: true,
      timezone: message.timezone,
      timezoneOffsetSeconds: message.timezoneOffsetSeconds,
      current: message.current,
      hourly: message.hourly,
      weekly: message.weekly,
      monthly: message.monthly,
    });

    return;
  }

  pending.resolve({
    fetchedAt: message.fetchedAt,
    ok: false,
    error: message.error,
  });
};

weatherWorker.onerror = (event) => {
  const fallbackError = event.message || "Error inesperado en worker de clima";

  for (const [id, pending] of pendingWorkerRequests.entries()) {
    pending.resolve({
      fetchedAt: Date.now(),
      ok: false,
      error: {
        message: fallbackError,
      },
    });

    pendingWorkerRequests.delete(id);
  }
};

const fetchSharedWeatherInWorker = (
  params: WeatherLocationParams,
  profile: WeatherFetchProfile,
): Promise<SharedWeatherFetchResult> => {
  const id = ++workerRequestId;
  const forecastDays =
    profile === "full" ? FULL_FORECAST_DAYS : CURRENT_FORRECAST_DAYS;

  const payload: WorkerRequestPayload = {
    id,
    params: {
      latitude: params.latitude,
      longitude: params.longitude,
      timezone: params.timezone ?? "auto",
      profile,
      forecastDays,
    },
  };

  return new Promise((resolve, reject) => {
    pendingWorkerRequests.set(id, { resolve, reject });
    weatherWorker.postMessage(payload);
  });
};

const buildErrorResult = (
  fetchedAt: number,
  message: string,
  type?: WeatherError["type"],
) => ({
  data: null,
  error: {
    message,
    type,
    timestamp: new Date(fetchedAt),
  },
  fetchedAt,
});

const buildMeta = (
  timezone: string,
  timezoneOffsetSeconds: number,
  fetchedAt: number,
) => ({
  timezone,
  timezoneOffsetSeconds,
  fetchedAt,
  expiresAt: fetchedAt + HOURLY_FORECAST_TTL_MS,
});

const buildWeeklyMeta = (
  timezone: string,
  timezoneOffsetSeconds: number,
  fetchedAt: number,
) => ({
  timezone,
  timezoneOffsetSeconds,
  fetchedAt,
  expiresAt: fetchedAt + WEEKLY_FORECAST_TTL_MS,
});

const buildMonthlyMeta = (
  timezone: string,
  timezoneOffsetSeconds: number,
  fetchedAt: number,
) => ({
  timezone,
  timezoneOffsetSeconds,
  fetchedAt,
  expiresAt: fetchedAt + MONTHLY_FORECAST_TTL_MS,
});

export class WeatherService {
  private readonly inFlightSharedFetches = new Map<
    string,
    Promise<SharedWeatherFetchResult>
  >();

  private readonly cachedSharedResponses = new Map<
    string,
    SharedWeatherFetchResult
  >();

  private getLocationKey = (
    params: WeatherLocationParams,
    profile: WeatherFetchProfile,
  ): string => {
    const timezone = params.timezone ?? "auto";
    return `${params.latitude}:${params.longitude}:${timezone}:${profile}`;
  };

  private fetchSharedWeather = async (
    params: WeatherLocationParams,
    profile: WeatherFetchProfile,
  ): Promise<SharedWeatherFetchResult> => {
    const now = Date.now();

    if (profile === "current") {
      const fullKey = this.getLocationKey(params, "full");
      const fullCached = this.cachedSharedResponses.get(fullKey);
      if (fullCached && now - fullCached.fetchedAt < SHARED_RESPONSE_TTL_MS) {
        return fullCached;
      }

      const fullInFlight = this.inFlightSharedFetches.get(fullKey);
      if (fullInFlight) return fullInFlight;
    }

    const key = this.getLocationKey(params, profile);

    const cachedResponse = this.cachedSharedResponses.get(key);
    if (
      cachedResponse &&
      now - cachedResponse.fetchedAt < SHARED_RESPONSE_TTL_MS
    ) {
      return cachedResponse;
    }

    const cachedPromise = this.inFlightSharedFetches.get(key);
    if (cachedPromise) return cachedPromise;

    const fetchPromise = (async () => {
      return fetchSharedWeatherInWorker(params, profile);
    })();

    this.inFlightSharedFetches.set(key, fetchPromise);

    try {
      const sharedResponse = await fetchPromise;
      this.cachedSharedResponses.set(key, sharedResponse);
      return sharedResponse;
    } finally {
      this.inFlightSharedFetches.delete(key);
    }
  };

  getCurrentWeather = async (
    params: WeatherLocationParams,
  ): Promise<CurrentWeatherResult> => {
    const fallbackFetchedAt = Date.now();

    try {
      const shared = await this.fetchSharedWeather(params, "current");

      if (!shared.ok || !shared.current) {
        return buildErrorResult(
          shared.fetchedAt,
          shared.error?.message || "Error al obtener los datos meteorológicos",
          shared.error?.type,
        );
      }

      return {
        data: shared.current,
        error: null,
        fetchedAt: shared.fetchedAt,
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Error inesperado al consultar el clima";

      return buildErrorResult(fallbackFetchedAt, message);
    }
  };

  getHourlyForecast = async (
    params: WeatherLocationParams,
  ): Promise<HourlyForecastResult> => {
    const fallbackFetchedAt = Date.now();

    try {
      const shared = await this.fetchSharedWeather(params, "full");

      if (
        !shared.ok ||
        !shared.hourly ||
        !shared.timezone ||
        shared.timezoneOffsetSeconds === undefined
      ) {
        return {
          data: null,
          error: {
            message:
              shared.error?.message ||
              "Error al obtener los datos meteorológicos",
            type: shared.error?.type,
            timestamp: new Date(shared.fetchedAt),
          },
          meta: null,
        };
      }

      return {
        data: shared.hourly,
        error: null,
        meta: buildMeta(
          shared.timezone,
          shared.timezoneOffsetSeconds,
          shared.fetchedAt,
        ),
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
          timestamp: new Date(fallbackFetchedAt),
        },
        meta: null,
      };
    }
  };

  getWeeklyForecast = async (
    params: WeatherLocationParams,
  ): Promise<WeeklyForecastResult> => {
    const fallbackFetchedAt = Date.now();

    try {
      const shared = await this.fetchSharedWeather(params, "full");

      if (
        !shared.ok ||
        !shared.weekly ||
        !shared.timezone ||
        shared.timezoneOffsetSeconds === undefined
      ) {
        return {
          data: null,
          error: {
            message:
              shared.error?.message ||
              "Error al obtener los datos meteorológicos",
            type: shared.error?.type,
            timestamp: new Date(shared.fetchedAt),
          },
          meta: null,
        };
      }

      return {
        data: shared.weekly,
        error: null,
        meta: buildWeeklyMeta(
          shared.timezone,
          shared.timezoneOffsetSeconds,
          shared.fetchedAt,
        ),
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
          timestamp: new Date(fallbackFetchedAt),
        },
        meta: null,
      };
    }
  };

  getMonthlyForecast = async (
    params: WeatherLocationParams,
  ): Promise<MonthlyForecastResult> => {
    const fallbackFetchedAt = Date.now();

    try {
      const shared = await this.fetchSharedWeather(params, "full");

      if (
        !shared.ok ||
        !shared.monthly ||
        !shared.timezone ||
        shared.timezoneOffsetSeconds === undefined
      ) {
        return {
          data: null,
          error: {
            message:
              shared.error?.message ||
              "Error al obtener los datos meteorologicos",
            type: shared.error?.type,
            timestamp: new Date(shared.fetchedAt),
          },
          meta: null,
        };
      }

      return {
        data: shared.monthly,
        error: null,
        meta: buildMonthlyMeta(
          shared.timezone,
          shared.timezoneOffsetSeconds,
          shared.fetchedAt,
        ),
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
          timestamp: new Date(fallbackFetchedAt),
        },
        meta: null,
      };
    }
  };
}

export const weatherService = new WeatherService();
