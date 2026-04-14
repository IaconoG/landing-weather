import { useEffect, useState } from "react";
import { weatherService } from "../../../services/weather/weather.service";
import type { CurrentWeatherResult } from "../../../types/weather.types";

type UseWeatherParams = {
  latitude: number | null;
  longitude: number | null;
};

const emptyWeather: CurrentWeatherResult = {
  data: null,
  error: null,
  fetchedAt: 0,
};

const useWeather = ({ latitude, longitude }: UseWeatherParams) => {
  const hasLocation = latitude !== null && longitude !== null;

  const [requestWeather, setRequestWeather] =
    useState<CurrentWeatherResult>(emptyWeather);
  const [requestLoading, setRequestLoading] = useState(false);

  useEffect(() => {
    if (!hasLocation) return;

    let cancelled = false;

    const run = async () => {
      setRequestLoading(true);

      const result = await weatherService.getCurrentWeather({
        latitude,
        longitude,
      });

      if (cancelled) return;

      setRequestWeather(result);
      setRequestLoading(false);
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [hasLocation, latitude, longitude]);

  const weather = hasLocation ? requestWeather : emptyWeather;
  const isLoading = hasLocation ? requestLoading : false;

  return {
    weather,
    isLoading,
  };
};

export default useWeather;
