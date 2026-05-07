import type {
  FetchError,
  FetchWeatherProps,
} from "@i-giann/open-meteo-wrapper";
import { runWeatherWorker } from "./weather.worker";
import {
  HOURLY_FORECAST_PARAMS,
  WEEKLY_DAILY_PARAMS,
} from "../../constants/weather.query";
import type { NormalizedWeatherProfile } from "./weather.adapter";

export type WeatherProfile = "day" | "week" | "month";

function getProfileParams(
  profile: WeatherProfile,
  params: FetchWeatherProps,
): FetchWeatherProps {
  switch (profile) {
    case "day":
      return {
        ...params,
        past_days: 0,
        forecast_days: 1,
        daily: WEEKLY_DAILY_PARAMS,
        hourly: HOURLY_FORECAST_PARAMS,
      };
    case "week":
      return {
        ...params,
        past_days: 3,
        forecast_days: 7,
        daily: WEEKLY_DAILY_PARAMS,
        hourly: HOURLY_FORECAST_PARAMS,
      };
    case "month":
      return {
        ...params,
        past_days: 7,
        forecast_days: 16,
        daily: WEEKLY_DAILY_PARAMS,
        hourly: HOURLY_FORECAST_PARAMS,
      };
    default:
      return params;
  }
}

export async function fetchWeatherProfile(
  profile: WeatherProfile,
  params: FetchWeatherProps,
): Promise<NormalizedWeatherProfile | FetchError> {
  const profileParams = getProfileParams(profile, params);
  return runWeatherWorker(profile, profileParams);
}
