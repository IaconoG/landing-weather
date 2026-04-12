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

  const currentWeather = useWeatherStore((state) => state.currentWeather);
  const currentError = useWeatherStore((state) => state.currentError);
  const isCurrentLoading = useWeatherStore((state) => state.isCurrentLoading);
  const currentFetchedAt = useWeatherStore((state) => state.currentFetchedAt);
  const currentExpiresAt = useWeatherStore((state) => state.currentExpiresAt);

  const setCurrentWeather = useWeatherStore((state) => state.setCurrentWeather);
  const setIsCurrentLoading = useWeatherStore(
    (state) => state.setIsCurrentLoading,
  );
  const setCurrentError = useWeatherStore((state) => state.setCurrentError);
  const setCurrentMeta = useWeatherStore((state) => state.setCurrentMeta);

  const { weather, isLoading } = useWeather({ latitude, longitude });
  const { data, error, fetchedAt } = weather;

  useEffect(() => {
    if (!isSameCurrentWeather(currentWeather, data)) setCurrentWeather(data);
    if (!isSameWeatherError(currentError, error)) setCurrentError(error);
    if (isCurrentLoading !== isLoading) setIsCurrentLoading(isLoading);
    if (fetchedAt > 0) {
      const expiresAt = fetchedAt + CURRENT_WEATHER_TTL_MS;
      if (currentFetchedAt !== fetchedAt || currentExpiresAt !== expiresAt) {
        setCurrentMeta(fetchedAt, expiresAt);
      }
    }
  }, [
    data,
    error,
    fetchedAt,
    isLoading,
    currentWeather,
    currentError,
    isCurrentLoading,
    currentFetchedAt,
    currentExpiresAt,
    setCurrentWeather,
    setCurrentError,
    setIsCurrentLoading,
    setCurrentMeta,
  ]);

  return null;
};

export default useWeatherController;
