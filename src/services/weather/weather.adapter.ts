import type { StructureWeatherData } from "@i-giann/open-meteo-wrapper";
import type { WeatherProfile } from "./weather.fetch-profile";
import type {
  CurrentWeather,
  HourlyForecastItem,
  MonthlyForecastItem,
  WeeklyForecastItem,
} from "../../types/weather.types";
import {
  mapToCurrentWeather,
  mapToHourlyForecast,
  mapToWeeklyForecast,
  mapToMonthlyForecast,
} from "./weather.mapper";

/**
 * Normalized payload stored in cache / used in UI, containing only the relevant data for each
 * profile, along with metadata
 */
export type NormalizedWeatherProfile = {
  profile: WeatherProfile;
  fetchedAt: number;
  timezone: string;
  timezoneOffsetSeconds?: number;
  current?: CurrentWeather;
  hourly?: HourlyForecastItem[];
  weekly?: WeeklyForecastItem[];
  monthly?: MonthlyForecastItem[];
};

export type UIWeatherByProfile = {
  day: {
    current?: CurrentWeather;
    hourly: HourlyForecastItem[];
  };
  week: {
    current?: CurrentWeather;
    hourly: HourlyForecastItem[];
    weekly: WeeklyForecastItem[];
  };
  month: {
    current?: CurrentWeather;
    hourly: HourlyForecastItem[];
    weekly: WeeklyForecastItem[];
    monthly: MonthlyForecastItem[];
  };
};

export type UIWeatherProfileData<P extends WeatherProfile = WeatherProfile> =
  UIWeatherByProfile[P];

export function normalizeWeather(
  raw: StructureWeatherData,
  profile: WeatherProfile,
): NormalizedWeatherProfile {
  const base = {
    profile,
    fetchedAt: Date.now(),
    timezone: raw.timezone,
    // timezoneOffsetSeconds: raw.timezoneOffsetSeconds,
    current: mapToCurrentWeather(raw),
  };

  switch (profile) {
    case "day":
      return {
        ...base,
        hourly: mapToHourlyForecast(raw),
      };

    case "week":
      return {
        ...base,
        hourly: mapToHourlyForecast(raw),
        weekly: mapToWeeklyForecast(raw),
      };

    case "month":
      return {
        ...base,
        hourly: mapToHourlyForecast(raw),
        weekly: mapToWeeklyForecast(raw),
        monthly: mapToMonthlyForecast(raw),
      };
  }
}

/**
 * Transforms the normalized weather data into the shape expected by the UI for each
 * profile. This allows us to keep the UI decoupled from the raw API response
 */
export function toUIWeather<P extends WeatherProfile>(
  normalized: NormalizedWeatherProfile,
  profile: P,
): UIWeatherProfileData<P> {
  switch (profile) {
    case "day":
      return {
        current: normalized.current,
        hourly: normalized.hourly ?? [],
      } as UIWeatherProfileData<P>;

    case "week":
      return {
        current: normalized.current,
        hourly: normalized.hourly ?? [],
        weekly: normalized.weekly ?? [],
      } as UIWeatherProfileData<P>;

    case "month":
      return {
        current: normalized.current,
        hourly: normalized.hourly ?? [],
        weekly: normalized.weekly ?? [],
        monthly: normalized.monthly ?? [],
      } as UIWeatherProfileData<P>;
  }
}
