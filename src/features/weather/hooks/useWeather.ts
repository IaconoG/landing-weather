import { useState, useEffect } from "react";
import { weatherService } from "../../../services/weather/weather.service";
import type { CurrentWeatherResult } from "../../../types/weather.types";

type UseWeatherParams = {
  latitude: number | null;
  longitude: number | null;
}

const useWeather = ({ latitude, longitude }: UseWeatherParams) => {
  const missingLocation = latitude === null || longitude === null;

  const [weather, setWeather] = useState<CurrentWeatherResult>({
    data: null,
    error: null,
    fetchedAt: 0,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    if (missingLocation) return;

    let cancelled = false;

    const run = async () => {
      setIsLoading(true);
      try {
        const result = await weatherService.getCurrentWeather({
          latitude: latitude as number,
          longitude: longitude as number,
        });

        if (!cancelled) setWeather(result);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    }
  }, [latitude, longitude, missingLocation]);

  return { 
    weather: missingLocation
      ? {
          data: null,
          error: null,
          fetchedAt: 0,
        }
      : weather,
    isLoading: missingLocation ? false : isLoading,
  };
};

export default useWeather;