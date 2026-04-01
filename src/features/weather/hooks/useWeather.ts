import { useState, useEffect, useMemo } from "react";
import { weatherService } from "../../../services/weather/weather.service";
import type { CurrentWeatherResult, WeatherError } from "../../../types/weather.types";

type UseWeatherParams = {
  latitude: number | null;
  longitude: number | null;
}

const buildMissingLocationError = (): WeatherError => ({
  message: 'No se pudo obtener la ubicación. Permite el acceso a tu ubicación para ver el clima o ingresa una ubicación manualmente.',
  type: undefined,
  timestamp: new Date(),
});

const useWeather = ({ latitude, longitude }: UseWeatherParams) => {
  const missingLocation = latitude === null || longitude === null;
  
  const missingLocationState = useMemo<CurrentWeatherResult>(
    () => ({
      data: null,
      error: buildMissingLocationError(),
      fetchedAt: 0
    } ),
    []
  );

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
    weather: missingLocation ? missingLocationState : weather,
    isLoading: missingLocation ? false : isLoading,
  };
};

export default useWeather;