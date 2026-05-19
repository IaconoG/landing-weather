import { useState, useEffect, useCallback, useMemo } from "react";
import type {
  FetchError,
  FetchWeatherProps,
} from "@i-giann/open-meteo-wrapper";
import {
  fetchWeatherProfile,
  type WeatherProfile,
} from "./weather.fetch-profile";
import { toUIWeather, type UIWeatherProfileData } from "./weather.adapter";
import { TTL } from "./utils/constants";
import {
  getCachedWeather,
  setCachedWeather,
  makeCacheKey,
  type QueryLocation,
} from "./weather.cache";

const isWrapperError = (response: unknown): response is FetchError => {
  return (
    typeof response === "object" && response !== null && "errorType" in response
  );
};

type UseWeatherProfileOptions = {
  enabled?: boolean;
  staleTimeMs?: number;
  cacheTimeMs?: number;
  cacheKey?: string;
  forceRefresh?: boolean;
  keepPreviousData?: boolean;
  onSuccess?: (meta: {
    profile: WeatherProfile;
    cacheKey: string;
    fetchedAt: number;
    expiresAt: number;
    fromCache: boolean;
  }) => void;
  onError?: (
    error: Error,
    meta: { profile: WeatherProfile; cacheKey: string },
  ) => void;
};

type QueryResult<T> = {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isFetching: boolean;
  isStale: boolean;
  fromCache: boolean;
  fetchedAt: number | null;
  expiresAt: number | null;
  refetch: () => Promise<void>;
};

const getLocation = (params: FetchWeatherProps): QueryLocation => ({
  latitude: params.latitude,
  longitude: params.longitude,
  timezone: params.timezone,
});

export function useWeatherProfile<P extends WeatherProfile>(
  profile: P,
  params: FetchWeatherProps,
  options: UseWeatherProfileOptions = {},
): QueryResult<UIWeatherProfileData<P>> {
  const {
    enabled = true,
    staleTimeMs = TTL[profile],
    cacheTimeMs = staleTimeMs,
    cacheKey,
    forceRefresh = false,
    keepPreviousData = true,
    onSuccess,
    onError,
  } = options;

  const locationKey = useMemo(() => getLocation(params), [params]);
  const resolvedCacheKey = useMemo(
    () => cacheKey ?? makeCacheKey(profile, locationKey),
    [cacheKey, profile, locationKey],
  );

  const cachedInit = enabled ? getCachedWeather(profile, locationKey) : null;

  const [data, setData] = useState<UIWeatherProfileData<P> | null>(() =>
    cachedInit ? toUIWeather(cachedInit.data, profile) : null,
  );
  const [error, setError] = useState<null | Error>(null);
  const [isLoading, setIsLoading] = useState<boolean>(enabled && !cachedInit);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isStale, setIsStale] = useState<boolean>(
    cachedInit ? cachedInit.expiresAt < Date.now() : false,
  );
  const [fromCache, setFromCache] = useState<boolean>(Boolean(cachedInit));
  const [fetchedAt, setFetchedAt] = useState<number | null>(
    cachedInit?.fetchedAt ?? null,
  );
  const [expiresAt, setExpiresAt] = useState<number | null>(
    cachedInit?.expiresAt ?? null,
  );

  const runFetch = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      setIsFetching(false);
      return;
    }

    const cached = getCachedWeather(profile, locationKey);
    const now = Date.now();
    const cacheFresh = cached && cached.expiresAt > now;

    if (cached && cacheFresh && !forceRefresh) {
      const nextData = toUIWeather(cached.data, profile);
      setData(nextData);
      setError(null);
      setIsLoading(false);
      setIsFetching(false);
      setIsStale(false);
      setFromCache(true);
      setFetchedAt(cached.fetchedAt);
      setExpiresAt(cached.expiresAt);
      onSuccess?.({
        profile,
        cacheKey: resolvedCacheKey,
        fetchedAt: cached.fetchedAt,
        expiresAt: cached.expiresAt,
        fromCache: true,
      });
      return;
    }
    if (cached && !cacheFresh && keepPreviousData) {
      setData(toUIWeather(cached.data, profile));
      setIsStale(true);
      setFromCache(true);
      setFetchedAt(cached.fetchedAt);
      setExpiresAt(cached.expiresAt);
    } else if (!keepPreviousData) {
      setData(null);
    }

    setIsLoading(!cached);
    setIsFetching(true);
    setError(null);

    try {
      const result = await fetchWeatherProfile(profile, params);

      if (isWrapperError(result)) {
        const nextError = new Error(
          result.error || "Error al obtener los datos meteorologicos",
        );
        setError(nextError);
        onError?.(nextError, { profile, cacheKey: resolvedCacheKey });
        return;
      }

      const stored = setCachedWeather(
        profile,
        locationKey,
        result,
        cacheTimeMs,
      );
      const nextData = toUIWeather(result, profile);
      setData(nextData);
      setFromCache(false);
      setIsStale(false);
      setFetchedAt(stored.fetchedAt);
      setExpiresAt(stored.expiresAt);

      onSuccess?.({
        profile,
        cacheKey: resolvedCacheKey,
        fetchedAt: stored.fetchedAt,
        expiresAt: stored.expiresAt,
        fromCache: false,
      });
    } catch (err) {
      const nextError = err instanceof Error ? err : new Error(String(err));
      setError(nextError);
      onError?.(nextError, { profile, cacheKey: resolvedCacheKey });
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [
    cacheTimeMs,
    enabled,
    forceRefresh,
    keepPreviousData,
    locationKey,
    onError,
    onSuccess,
    params,
    profile,
    resolvedCacheKey,
  ]);

  useEffect(() => {
    void runFetch();
  }, [runFetch]);

  return {
    data,
    error,
    isLoading,
    isFetching,
    isStale,
    fromCache,
    fetchedAt,
    expiresAt,
    refetch: runFetch,
  };
}
