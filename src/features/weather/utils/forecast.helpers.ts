import type { ForecastMeta } from "../../../types/weather.types";
import { getTimeZoneOffsetSeconds } from "../../../services/weather/utils";

/**
 * Returns true if a cache entry is still valid.
 */
export const isCacheValid = (expiresAt: number | null): boolean => {
  if (expiresAt === null) return false;
  return Date.now() < expiresAt;
};

type CachedForecastInput<T> = {
  data: T[] | null;
  expiresAt: number | null;
};
/**
 * Returns true if the forecast can still be reused from cache.
 */
export const shouldUseCachedForecast = <T>({
  data,
  expiresAt,
}: CachedForecastInput<T>): boolean => {
  return data !== null && isCacheValid(expiresAt);
};

type ForecastMetaInput = {
  timezone: string;
  fetchedAt: number;
  ttlMs: number;
};
/**
 * Builds normalized forecast metadata with TTL and timezone offset.
 */
export const buildForecastMeta = ({
  timezone,
  fetchedAt,
  ttlMs,
}: ForecastMetaInput): ForecastMeta => {
  return {
    timezone,
    timezoneOffsetSeconds: getTimeZoneOffsetSeconds(timezone, fetchedAt),
    fetchedAt,
    expiresAt: fetchedAt + ttlMs,
  };
};

type ShouldRefetchForecastInput<T> = {
  data: T[] | null;
  expiresAt: number | null;
};
/**
 * Returns true when forecast should be refetched.
 */
export const shouldRefetchForecast = <T>({
  data,
  expiresAt,
}: ShouldRefetchForecastInput<T>): boolean => {
  return !shouldUseCachedForecast({ data, expiresAt });
};
