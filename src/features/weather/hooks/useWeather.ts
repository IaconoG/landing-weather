import { useState, useEffect, useMemo } from "react";
import { weatherService } from "../../../services/weather/weather.service";
import type { CurrentWeatherResult, WeatherError } from "../../../types/weather.types";

type UseWeatherParams = {
  latitude: number | null;
  longitude: number | null;
}

const buildMissingLocationError = (): WeatherError => ({
  message: 'No se pudo obtner la ubicación. Permite el acceso a tu ubicación para ver el clima o ingresa una ubicación manualmente.',
  type: undefined,
  timestamp: new Date(),
});

const useWeather = ({ latitude, longitude }: UseWeatherParams) => {
  const missingLocation = latitude === null || longitude === null;

  const initialState = useMemo<CurrentWeatherResult>(
    () => 
      missingLocation
        ? { data: null, error: buildMissingLocationError(), fetchedAt: 0 }
        : { data: null, error: null, fetchedAt: 0 },
    [missingLocation]
  );

  const [weather, setWeather] = useState<CurrentWeatherResult>(initialState)

  useEffect(() => {
    if (missingLocation) return;

    let cancelled = false;

    const run = async () => {
      const result = await weatherService.getCurrentWeather({
        latitude: latitude! as number,
        longitude: longitude! as number,
      });

      if (!cancelled) setWeather(result);
    };

    run();

    return () => {
      cancelled = true;
    }
  }, [latitude, longitude, missingLocation]);
  return weather;
};

export default useWeather;