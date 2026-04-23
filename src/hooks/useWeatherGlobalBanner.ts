import { useMemo } from "react";
import { useWeatherStore } from "../store/weather.store";
import useFocusLocationInput from "../features/location/hooks/useFocusLocationInput";

type WeatherGlobalBannerState =
  | { type: "info"; message: string; actionLabel: string }
  | { type: "error"; message: string; actionLabel: string }
  | null;

const useWeatherGlobalBanner = () => {
  const latitude = useWeatherStore((state) => state.latitude);
  const longitude = useWeatherStore((state) => state.longitude);

  const currentError = useWeatherStore((state) => state.current.error);
  const hourlyError = useWeatherStore((state) => state.hourly.error);
  const monthlyError = useWeatherStore((state) => state.monthly.error);

  const focusLocationInput = useFocusLocationInput();

  const hasLocation = latitude !== null && longitude !== null;
  const hasError = Boolean(currentError || hourlyError || monthlyError);

  const bannerState = useMemo<WeatherGlobalBannerState>(() => {
    if (!hasLocation) {
      return {
        type: "info",
        message: "Selecciona una ubicación para ver el pronóstico del tiempo",
        actionLabel: "Seleccionar ubicación",
      };
    }

    if (hasError) {
      return {
        type: "error",
        message: "Ocurrió un error al obtener el pronóstico del tiempo",
        actionLabel: "Ir al buscador",
      };
    }

    return null;
  }, [hasLocation, hasError]);

  return { bannerState, onActionClick: focusLocationInput };
};

export default useWeatherGlobalBanner;
