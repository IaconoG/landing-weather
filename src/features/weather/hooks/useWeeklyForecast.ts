import { useEffect, useState } from "react";
import { weatherService } from "../../../services/weather/weather.service";
import type {
  WeeklyForecastItem,
  WeeklyForecastResult,
  WeatherError,
} from "../../../types/weather.types";
import { shouldUseCachedForecast } from "../utils/forecast.helpers";
import { resolveFetchState } from "../utils/fetchState.helpers";

type UseWeeklyForecastParams = {
  latitude: number | null;
  longitude: number | null;
  cachedData: WeeklyForecastItem[] | null;
  expiresAt: number | null;
};

type UseWeeklyForecastState = {
  data: WeeklyForecastItem[] | null;
  error: WeatherError | null;
  fetchedAt: number | null;
  expiresAt: number | null;
  requestKey: string | null;
};

const useWeeklyForecast = ({
  latitude,
  longitude,
  cachedData,
  expiresAt,
}: UseWeeklyForecastParams) => {
  const hasLocation = latitude !== null && longitude !== null;
  const requestKey = hasLocation ? `${latitude},${longitude}` : null;
  const canUseCache = shouldUseCachedForecast({ data: cachedData, expiresAt });

  const [state, setState] = useState<UseWeeklyForecastState>({
    data: null,
    error: null,
    fetchedAt: null,
    expiresAt: null,
    requestKey: null,
  });

  useEffect(() => {
    if (!hasLocation || canUseCache) return;

    let cancelled = false;

    const run = async () => {
      const result: WeeklyForecastResult =
        await weatherService.getWeeklyForecast({
          latitude,
          longitude,
        });

      if (cancelled) return;

      setState({
        data: result.data,
        error: result.error,
        fetchedAt: result.meta?.fetchedAt ?? null,
        expiresAt: result.meta?.expiresAt ?? null,
        requestKey,
      });
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [hasLocation, canUseCache, latitude, longitude, requestKey]);

  return resolveFetchState({
    hasLocation,
    canUseCache,
    cachedData,
    cachedExpiresAt: expiresAt,
    requestKey,
    stateRequestKey: state.requestKey,
    stateData: state.data,
    stateError: state.error,
    stateFetchedAt: state.fetchedAt,
    stateExpiresAt: state.expiresAt,
  });
};

export default useWeeklyForecast;
