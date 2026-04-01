import { useEffect } from "react";
import type { CurrentWeather, WeatherError } from "../../../types/weather.types";
import { useWeatherStore } from "../store/weather.store";
import useWeather from "./useWeather";

const isSameCurrentWeather = (a: CurrentWeather | null, b: CurrentWeather | null): boolean => {
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
    a?.timestamp === b?.timestamp
  );
}

const isSameWeatherError = (a: WeatherError | null, b: WeatherError | null): boolean => {
  if (a === b) return true;
  if (!a || !b) return false;

  return (
    a.message === b.message &&
    a.type === b.type &&
    a.timestamp.getTime() === b.timestamp.getTime()
  );
}


const useWeatherController = () => {
  const latitude = useWeatherStore((state) => state.latitude);
  const longitude = useWeatherStore((state) => state.longitude);

  const currentWeather = useWeatherStore((state) => state.currentWeather)
  const weatherError = useWeatherStore((state) => state.weatherError)
  const isWeatherLoading = useWeatherStore((state) => state.isWeatherLoading)

  const setCurrentWeather = useWeatherStore((state) => state.setCurrentWeather);
  const setIsWeatherLoading = useWeatherStore((state) => state.setIsWeatherLoading);
  const setWeatherError = useWeatherStore((state) => state.setWeatherError);

  const { weather, isLoading } = useWeather({ latitude, longitude });
  const { data, error } = weather;


  useEffect(() => {
    if (!isSameCurrentWeather(currentWeather, data)) setCurrentWeather(data);
    if (!isSameWeatherError(weatherError, error)) setWeatherError(error);
    if (isWeatherLoading !== isLoading) setIsWeatherLoading(isLoading);
  }, [
    data,
    error,
    isLoading,
    currentWeather,
    weatherError,
    isWeatherLoading,
    setCurrentWeather,
    setWeatherError,
    setIsWeatherLoading,
  ]);

  return null;
}

export default useWeatherController;