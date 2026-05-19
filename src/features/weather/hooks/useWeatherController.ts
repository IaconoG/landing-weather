import { useEffect, useMemo } from "react";
import type { FetchWeatherProps } from "@i-giann/open-meteo-wrapper";
import { useWeatherStore } from "../../../store/weather.store";
import { useWeatherProfile } from "../../../services/weather/useWeatherProfile";
import { TTL } from "../../../services/weather/utils/constants";

const useWeatherController = () => {
  const latitude = useWeatherStore((state) => state.latitude);
  const longitude = useWeatherStore((state) => state.longitude);

  const setCurrentState = useWeatherStore((state) => state.setCurrentState);
  const setHourlyState = useWeatherStore((state) => state.setHourlyState);
  const setWeeklyState = useWeatherStore((state) => state.setWeeklyState);
  const setMonthlyState = useWeatherStore((state) => state.setMonthlyState);

  const hasLocation = latitude !== null && longitude !== null;

  const params: FetchWeatherProps | null = useMemo(() => {
    if (!hasLocation) return null;

    return {
      latitude: latitude,
      longitude: longitude,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }, [hasLocation, latitude, longitude]);

  // Fetch all profiles
  const day = useWeatherProfile(
    "day",
    params ?? { latitude: 0, longitude: 0, timezone: "" },
    {
      enabled: hasLocation,
      staleTimeMs: TTL.day,
      keepPreviousData: true,
    },
  );
  const week = useWeatherProfile(
    "week",
    params ?? { latitude: 0, longitude: 0, timezone: "" },
    {
      enabled: hasLocation,
      staleTimeMs: TTL.week,
      keepPreviousData: true,
    },
  );
  const month = useWeatherProfile(
    "month",
    params ?? { latitude: 0, longitude: 0, timezone: "" },
    {
      enabled: hasLocation,
      staleTimeMs: TTL.month,
      keepPreviousData: true,
    },
  );

  useEffect(() => {
    if (!hasLocation) {
      setCurrentState({
        data: null,
        error: null,
        isLoading: false,
        fetchedAt: null,
        expiresAt: null,
      });
      setHourlyState({
        data: null,
        error: null,
        isLoading: false,
        fetchedAt: null,
        expiresAt: null,
      });
      setWeeklyState({
        data: null,
        error: null,
        isLoading: false,
        fetchedAt: null,
        expiresAt: null,
      });
      setMonthlyState({
        data: null,
        error: null,
        isLoading: false,
        fetchedAt: null,
        expiresAt: null,
      });
      return;
    }

    setCurrentState({
      data: day.data?.current || null,
      error: day.error
        ? { message: day.error.message, timestamp: new Date() }
        : null,
      isLoading: day.isLoading,
      fetchedAt: day.fetchedAt,
      expiresAt: day.expiresAt,
      source: day.fromCache ? "cache" : "network",
      stale: day.isStale,
    });

    // setHourlyState({
    //   data: week.data?.hourly || null,
    //   error: week.error
    //     ? { message: week.error.message, timestamp: new Date() }
    //     : null,
    //   isLoading: week.isLoading,
    //   fetchedAt: week.fetchedAt,
    //   expiresAt: week.expiresAt,
    //   source: week.fromCache ? "cache" : "network",
    //   stale: week.isStale,
    // });

    setWeeklyState({
      data: week.data?.weekly || null,
      error: week.error
        ? { message: week.error.message, timestamp: new Date() }
        : null,
      isLoading: week.isLoading,
      fetchedAt: week.fetchedAt,
      expiresAt: week.expiresAt,
      source: week.fromCache ? "cache" : "network",
      stale: week.isStale,
    });

    setMonthlyState({
      data: month.data?.monthly || null,
      error: month.error
        ? { message: month.error.message, timestamp: new Date() }
        : null,
      isLoading: month.isLoading,
      fetchedAt: month.fetchedAt,
      expiresAt: month.expiresAt,
      source: month.fromCache ? "cache" : "network",
      stale: month.isStale,
    });
  }, [
    hasLocation,

    day.data,
    day.error,
    day.fetchedAt,
    day.expiresAt,
    day.isLoading,
    day.fromCache,
    day.isStale,

    week.data,
    week.error,
    week.fetchedAt,
    week.expiresAt,
    week.isLoading,
    week.fromCache,
    week.isStale,

    month.data,
    month.error,
    month.fetchedAt,
    month.expiresAt,
    month.isLoading,
    month.fromCache,
    month.isStale,

    setCurrentState,
    setHourlyState,
    setWeeklyState,
    setMonthlyState,
  ]);

  return null;
};

export default useWeatherController;
