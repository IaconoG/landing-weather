import { useEffect } from "react";
import { useWeatherStore } from "../../../store/weather.store";
import useHourlyForecast from "./useHourlyForecast";
import useWeeklyForecast from "./useWeeklyForecast";
import type {
  HourlyForecastItem,
  WeeklyForecastItem,
  WeatherError,
} from "../../../types/weather.types";

type ForecastState<T> = {
  data: T[] | null;
  error: WeatherError | null;
  fetchedAt: number | null;
  expiresAt: number | null;
  isLoading: boolean;
};

const isSameForecastState = <T>(
  a: ForecastState<T>,
  b: ForecastState<T>,
): boolean => {
  const sameError =
    a.error === b.error ||
    (!!a.error &&
      !!b.error &&
      a.error.message === b.error.message &&
      a.error.type === b.error.type &&
      a.error.timestamp.getTime() === b.error.timestamp.getTime());

  return (
    a.data === b.data &&
    sameError &&
    a.fetchedAt === b.fetchedAt &&
    a.expiresAt === b.expiresAt &&
    a.isLoading === b.isLoading
  );
};

const useForecastController = () => {
  const latitude = useWeatherStore((state) => state.latitude);
  const longitude = useWeatherStore((state) => state.longitude);

  const hourly = useWeatherStore((state) => state.hourly);
  const weekly = useWeatherStore((state) => state.weekly);

  const setHourlyState = useWeatherStore((state) => state.setHourlyState);
  const setWeeklyState = useWeatherStore((state) => state.setWeeklyState);

  const hourlyState = useHourlyForecast({
    latitude,
    longitude,
    cachedData: hourly.data as HourlyForecastItem[] | null,
    expiresAt: hourly.expiresAt,
  });

  const weeklyState = useWeeklyForecast({
    latitude,
    longitude,
    cachedData: weekly.data as WeeklyForecastItem[] | null,
    expiresAt: weekly.expiresAt,
  });

  useEffect(() => {
    if (
      isSameForecastState(hourly, {
        data: hourlyState.data,
        error: hourlyState.error,
        fetchedAt: hourlyState.fetchedAt,
        expiresAt: hourlyState.expiresAt,
        isLoading: hourlyState.isLoading,
      })
    ) {
      return;
    }

    setHourlyState({
      data: hourlyState.data,
      fetchedAt: hourlyState.fetchedAt,
      expiresAt: hourlyState.expiresAt,
      error: hourlyState.error,
      isLoading: hourlyState.isLoading,
    });
  }, [
    hourly,
    hourlyState.data,
    hourlyState.error,
    hourlyState.fetchedAt,
    hourlyState.expiresAt,
    hourlyState.isLoading,
    setHourlyState,
  ]);

  useEffect(() => {
    if (
      isSameForecastState(weekly, {
        data: weeklyState.data,
        error: weeklyState.error,
        fetchedAt: weeklyState.fetchedAt,
        expiresAt: weeklyState.expiresAt,
        isLoading: weeklyState.isLoading,
      })
    ) {
      return;
    }

    setWeeklyState({
      data: weeklyState.data,
      fetchedAt: weeklyState.fetchedAt,
      expiresAt: weeklyState.expiresAt,
      error: weeklyState.error,
      isLoading: weeklyState.isLoading,
    });
  }, [
    weekly,
    weeklyState.data,
    weeklyState.error,
    weeklyState.fetchedAt,
    weeklyState.expiresAt,
    weeklyState.isLoading,
    setWeeklyState,
  ]);

  return null;
};

export default useForecastController;
