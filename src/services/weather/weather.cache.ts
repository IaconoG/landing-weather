import type { WeatherProfile } from "./weather.fetch-profile";
import type { NormalizedWeatherProfile } from "./weather.adapter";

export type QueryLocation = {
  latitude: number;
  longitude: number;
  timezone?: string;
};

type CacheKey = string; // e.g. "day:40.7128,-74.0060,America/New_York"

type CacheEntry<T> = {
  key: CacheKey;
  profile: WeatherProfile;
  location: QueryLocation;
  data: T;
  fetchedAt: number;
  expiresAt: number;
  version: 1;
};

const STORAGE_PREFIX = "weather_cache_v1_";
const memoryCache = new Map<CacheKey, CacheEntry<NormalizedWeatherProfile>>();

const round4 = (num: number) => (Math.round(num * 10000) / 10000).toFixed(4);

export const makeCacheKey = (
  profile: WeatherProfile,
  location: QueryLocation,
): CacheKey => {
  return `weather:v1:profile=${profile}:lat=${round4(location.latitude)}:lon=${round4(location.longitude)}:tz=${location.timezone}`;
};

const storageKey = (key: CacheKey) => `${STORAGE_PREFIX}${key}`;

const readPersistedEntry = (
  key: CacheKey,
): CacheEntry<NormalizedWeatherProfile> | null => {
  if (typeof window === "undefined") return null; // SSR guard

  const raw = window.localStorage.getItem(storageKey(key));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as CacheEntry<NormalizedWeatherProfile>;
  } catch {
    window.localStorage.removeItem(storageKey(key)); // Clean up corrupted entry
    return null;
  }
};

const writePersistedEntry = (
  entry: CacheEntry<NormalizedWeatherProfile>,
): void => {
  if (typeof window === "undefined") return; // SSR guard
  window.localStorage.setItem(storageKey(entry.key), JSON.stringify(entry));
};

export function hydrateWeatherCache(): void {
  if (typeof window === "undefined") return; // SSR guard

  for (let idx = 0; idx < window.localStorage.length; idx++) {
    const key = window.localStorage.key(idx);
    if (!key || !key.startsWith(STORAGE_PREFIX)) continue;

    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;

      const entry = JSON.parse(raw) as CacheEntry<NormalizedWeatherProfile>;
      if (entry.expiresAt <= Date.now()) {
        window.localStorage.removeItem(key);
        continue;
      }

      memoryCache.set(entry.key, entry);
    } catch {
      window.localStorage.removeItem(key); // Clean up corrupted entry
    }
  }
}

export function getCachedWeather(
  profile: WeatherProfile,
  location: QueryLocation,
): CacheEntry<NormalizedWeatherProfile> | null {
  const key = makeCacheKey(profile, location);

  const inMemory = memoryCache.get(key);
  if (inMemory) {
    if (inMemory.expiresAt > Date.now()) return inMemory;
    memoryCache.delete(key);
    if (typeof window !== "undefined")
      window.localStorage.removeItem(storageKey(key));
    return null;
  }

  const persisted = readPersistedEntry(key);
  if (!persisted) return null;

  if (persisted.expiresAt <= Date.now()) {
    if (typeof window !== "undefined")
      window.localStorage.removeItem(storageKey(key));
    return null;
  }

  memoryCache.set(key, persisted);
  return persisted;
}

export function setCachedWeather(
  profile: WeatherProfile,
  location: QueryLocation,
  data: NormalizedWeatherProfile,
  ttl: number,
): CacheEntry<NormalizedWeatherProfile> {
  const now = Date.now();
  const entry: CacheEntry<NormalizedWeatherProfile> = {
    key: makeCacheKey(profile, location),
    profile,
    location,
    data,
    fetchedAt: now,
    expiresAt: now + ttl,
    version: 1,
  };

  memoryCache.set(entry.key, entry);
  writePersistedEntry(entry);

  return entry;
}

export function pruneExpiredWeatherCache(now: number = Date.now()): void {
  for (const [key, entry] of memoryCache.entries()) {
    if (entry.expiresAt > now) continue;
    memoryCache.delete(key);
    if (typeof window !== "undefined")
      window.localStorage.removeItem(storageKey(key));
  }
}

export function clearWeatherCache(): void {
  memoryCache.clear();

  if (typeof window === "undefined") return; // SSR guard

  const keysToRemove: string[] = [];
  for (let idx = 0; idx < window.localStorage.length; idx++) {
    const key = window.localStorage.key(idx);
    if (key?.startsWith(STORAGE_PREFIX)) keysToRemove.push(key);
  }

  for (const key of keysToRemove) {
    window.localStorage.removeItem(key);
  }
}
