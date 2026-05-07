import { useState, useEffect } from "react";
import {
  fetchWeatherProfile,
  type WeatherProfile,
} from "./weather.fetch-profile";
import { getCachedWeather, setCachedWeather } from "./weather.cache";
import { toUIWeather, type UIWeatherProfileData } from "./weather.adapter";
import type {
  FetchError,
  FetchWeatherProps,
} from "@i-giann/open-meteo-wrapper";
import { TTL } from "./utils/constants";

const isWrapperError = (response: unknown): response is FetchError => {
  return (
    typeof response === "object" && response !== null && "errorType" in response
  );
};

type UseWeatherProfileOptions = {
  enableCache?: boolean;
};

export function useWeatherProfile<P extends WeatherProfile>(
  profile: P,
  params: FetchWeatherProps,
  options: UseWeatherProfileOptions = {},
) {
  const { enableCache = true } = options || {};
  const locationKey = `${params.latitude},${params.longitude},${params.timezone}`;
  const cachedInit = enableCache
    ? getCachedWeather(profile, locationKey)
    : null;

  const [data, setData] = useState<UIWeatherProfileData<P> | null>(() =>
    cachedInit ? toUIWeather(cachedInit, profile) : null,
  );
  const [loading, setLoading] = useState(enableCache && !cachedInit);
  const [error, setError] = useState<null | Error>(null);

  useEffect(() => {
    if (!enableCache) return;

    const cached = getCachedWeather(profile, locationKey);
    if (cached) {
      Promise.resolve().then(() => {
        setData(toUIWeather(cached, profile));
        setLoading(false);
      });
      return;
    }

    let cancelled = false;
    Promise.resolve().then(() => setLoading(true));

    fetchWeatherProfile(profile, params)
      .then((result) => {
        if (cancelled) return;

        if (isWrapperError(result)) {
          setError(
            new Error(
              result.error || "Error al obtener los datos meteorologicos",
            ),
          );
          setData(null);
          return;
        }

        setCachedWeather(profile, locationKey, result, TTL[profile]);
        setData(toUIWeather(result, profile));
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enableCache, profile, params, locationKey]);

  return { data, loading, error };
}
