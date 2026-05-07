/// <reference lib="webworker" />

import {
  ErrorType,
  fetchWeather,
  MessageType,
  type FetchError,
  type FetchWeatherProps,
  type StructureWeatherData,
} from "@i-giann/open-meteo-wrapper";
import { normalizeWeather } from "./weather.adapter";
import type { NormalizedWeatherProfile } from "./weather.adapter";
import type { WeatherProfile } from "./weather.fetch-profile";

/* Message sent from main thread to worker */
type WorkerRequest = {
  profile: WeatherProfile;
  params: FetchWeatherProps;
};
/* Success response from worker */
type WorkerSuccess = {
  type: "success";
  data: NormalizedWeatherProfile;
};
/* Failure response from worker */
type WorkerFailure = {
  type: "error";
  error: {
    message: string;
    errorType?: string;
  };
};

type WorkerResponse = WorkerSuccess | WorkerFailure;

const isWrapperError = (
  response: StructureWeatherData | FetchError,
): response is FetchError => {
  return (
    typeof response === "object" && response !== null && "errorType" in response
  );
};

/* Worker message handler: receive profile+params, fetch, normalize, send back */
self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { profile, params } = event.data;

  try {
    const raw = await fetchWeather(params);

    if (isWrapperError(raw)) {
      const errResponse: WorkerFailure = {
        type: "error",
        error: {
          message: raw.error || "Erro al obtener los datos meteorologicos",
          errorType: raw.errorType,
        },
      };
      self.postMessage(errResponse);
      return;
    }

    const normalized = normalizeWeather(raw, profile);
    const response: WorkerSuccess = {
      type: "success",
      data: normalized,
    };
    self.postMessage(response);
  } catch (error: unknown) {
    const errResponse: WorkerFailure = {
      type: "error",
      error: {
        message:
          error instanceof Error
            ? error.message
            : "Error desconocido al obtener los datos meteorologicos",
      },
    };
    self.postMessage(errResponse);
  }
};

/**
 * Main thread helper function to call the worker and get weather data for a profile+params
 * - Returns a promise that resolves with NormalizedWeatherProfile on success, or FetchError on failure
 * - Handles worker lifecycle, message passing, and error handling uniformly
 * - Caller can use this function to fetch weather data without worrying about worker details
 */
export function runWeatherWorker(
  profile: WeatherProfile,
  params: FetchWeatherProps,
): Promise<NormalizedWeatherProfile | FetchError> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./weather.worker.ts", import.meta.url), {
      type: "module",
    });

    const timeout = setTimeout(() => {
      worker.terminate();
      reject(
        new Error("Worker timeout: no response received within expected time"),
      );
    }, 30000); // 30 seconds timeout

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      clearTimeout(timeout);
      worker.terminate();

      const { type } = event.data;
      if (type === "success") {
        resolve(event.data.data);
      } else {
        const errorData = event.data.error;
        const fetchError: FetchError = {
          error: errorData.message,
          type: MessageType.ERROR,
          errorType:
            (errorData.errorType as ErrorType) || ErrorType.UNKNOWN_ERROR,
        };
        resolve(fetchError); // Return FetchError, not rejecting, to let caller handle it uniformly
      }
    };

    worker.onerror = (error) => {
      clearTimeout(timeout);
      worker.terminate();
      reject(
        error.error ||
          new Error("Worker error: An error occurred in the worker"),
      );
    };

    worker.postMessage({ profile, params });
  });
}

export {};
