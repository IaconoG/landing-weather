import type { WeatherProfile } from "./weather.fetch-profile";
import type { NormalizedWeatherProfile } from "./weather.adapter";

const cache = new Map<
  string,
  { data: NormalizedWeatherProfile; expires: number }
>();

function getKey(profile: WeatherProfile, location: string) {
  return `${profile}:${location}`;
}

export function getCachedWeather(profile: WeatherProfile, location: string) {
  const key = getKey(profile, location);
  const entry = cache.get(key);
  if (entry && entry.expires > Date.now()) return entry.data;
  return null;
}

export function setCachedWeather(
  profile: WeatherProfile,
  location: string,
  data: NormalizedWeatherProfile,
  ttl: number,
) {
  const key = getKey(profile, location);
  cache.set(key, { data, expires: Date.now() + ttl });
}

export function invalidateWeatherCache(
  profile: WeatherProfile,
  location: string,
) {
  const key = getKey(profile, location);
  cache.delete(key);
}

export function clearWeatherCache() {
  cache.clear();
}

export function invalidateByProfile(profile: WeatherProfile) {
  for (const key of cache.keys()) {
    if (key.startsWith(profile + ":")) {
      cache.delete(key);
    }
  }
}

export function invalidateByLocation(location: string) {
  for (const key of cache.keys()) {
    if (key.endsWith(":" + location)) {
      cache.delete(key);
    }
  }
}
