import { useEffect } from "react";
import { useWeatherStore } from "../../../store/weather.store";
import { useWeatherProfile } from "../../../services/weather/useWeatherProfile";
import type { FetchWeatherProps } from "@i-giann/open-meteo-wrapper";
import { TTL } from "../../../services/weather/utils/constants";

const useWeatherController = () => {
  const latitude = useWeatherStore((state) => state.latitude);
  const longitude = useWeatherStore((state) => state.longitude);

  const setCurrentState = useWeatherStore((state) => state.setCurrentState);
  const setHourlyState = useWeatherStore((state) => state.setHourlyState);
  const setWeeklyState = useWeatherStore((state) => state.setWeeklyState);
  const setMonthlyState = useWeatherStore((state) => state.setMonthlyState);

  const params: FetchWeatherProps = {
    latitude: latitude!,
    longitude: longitude!,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  // Fetch all profiles
  const day = useWeatherProfile("day", params);
  const week = useWeatherProfile("week", params);
  const month = useWeatherProfile("month", params);

  useEffect(() => {
    setCurrentState({
      data: day.data?.current || null,
      error: day.error
        ? { message: day.error.message, timestamp: new Date() }
        : null,
      isLoading: day.loading,
      fetchedAt: day.data ? Date.now() : null,
      expiresAt: day.data ? Date.now() + TTL.day : null,
    });

    setHourlyState({
      data: week.data?.hourly || null,
      error: week.error
        ? { message: week.error.message, timestamp: new Date() }
        : null,
      isLoading: week.loading,
      fetchedAt: week.data ? Date.now() : null,
      expiresAt: week.data ? Date.now() + TTL.week : null,
    });

    setWeeklyState({
      data: week.data?.weekly || null,
      error: week.error
        ? { message: week.error.message, timestamp: new Date() }
        : null,
      isLoading: week.loading,
      fetchedAt: week.data ? Date.now() : null,
      expiresAt: week.data ? Date.now() + TTL.week : null,
    });

    setMonthlyState({
      data: month.data?.monthly || null,
      error: month.error
        ? { message: month.error.message, timestamp: new Date() }
        : null,
      isLoading: month.loading,
      fetchedAt: month.data ? Date.now() : null,
      expiresAt: month.data ? Date.now() + TTL.month : null,
    });
  }, [
    day.data,
    day.loading,
    day.error,
    week.data,
    week.loading,
    week.error,
    month.data,
    month.loading,
    month.error,
    setCurrentState,
    setHourlyState,
    setWeeklyState,
    setMonthlyState,
  ]);

  return null;
};

export default useWeatherController;
