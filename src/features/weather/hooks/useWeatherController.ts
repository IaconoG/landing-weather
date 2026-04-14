import { useEffect } from "react";
import type {
  CurrentWeather,
  WeatherError,
} from "../../../types/weather.types";
import { useWeatherStore } from "../../../store/weather.store";
import useWeather from "./useWeather";
import { CURRENT_WEATHER_TTL_MS } from "../../../constants/weather.cache";

const isSameCurrentWeather = (
  a: CurrentWeather | null,
  b: CurrentWeather | null,
): boolean => {
  if (a === b) return true;
  if (!a || !b) return false;

  return (
    a.temperature === b.temperature &&
    a.feelsLike === b.feelsLike &&
    a.humidity === b.humidity &&
    a.weatherDescription === b.weatherDescription &&
    a.windSpeed === b.windSpeed &&
    a.pressure === b.pressure &&
    a.visibility === b.visibility &&
    a.uv === b.uv &&
    a.timestamp === b.timestamp
  );
};

const isSameWeatherError = (
  a: WeatherError | null,
  b: WeatherError | null,
): boolean => {
  if (a === b) return true;
  if (!a || !b) return false;

  return (
    a.message === b.message &&
    a.type === b.type &&
    a.timestamp.getTime() === b.timestamp.getTime()
  );
};

const useWeatherController = () => {
  const latitude = useWeatherStore((state) => state.latitude);
  const longitude = useWeatherStore((state) => state.longitude);

  const current = useWeatherStore((state) => state.current);
  const setCurrentState = useWeatherStore((state) => state.setCurrentState);

  const { weather, isLoading } = useWeather({ latitude, longitude });

  useEffect(() => {
    const fetchedAt = weather.fetchedAt > 0 ? weather.fetchedAt : null;
    const expiresAt =
      fetchedAt !== null ? fetchedAt + CURRENT_WEATHER_TTL_MS : null;

    const sameData = isSameCurrentWeather(current.data, weather.data);
    const sameError = isSameWeatherError(current.error, weather.error);
    const sameLoading = current.isLoading === isLoading;
    const sameFetchedAt = current.fetchedAt === fetchedAt;
    const sameExpiresAt = current.expiresAt === expiresAt;

    if (sameData && sameError && sameLoading && sameFetchedAt && sameExpiresAt)
      return;

    setCurrentState({
      data: weather.data,
      error: weather.error,
      isLoading,
      fetchedAt,
      expiresAt,
    });
  }, [
    current.data,
    current.error,
    current.isLoading,
    current.fetchedAt,
    current.expiresAt,

    weather.data,
    weather.error,
    weather.fetchedAt,
    isLoading,
    setCurrentState,
  ]);
  return null;
};

export default useWeatherController;
