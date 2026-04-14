import { useCallback, useState } from "react";

export type BrowserLocation = {
  latitude: number;
  longitude: number;
};

type UseLocationResult = {
  location: BrowserLocation | null;
  error: string | null;
  isLoading: boolean;
  requestLocation: () => void;
  clearLocationError: () => void;
};

const useBrowserGeolocation = (): UseLocationResult => {
  const [location, setLocation] = useState<BrowserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clearLocationError = useCallback(() => {
    setError(null);
  }, []);

  const requestLocation = useCallback(() => {
    setError(null);

    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización.");
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (geoError: GeolocationPositionError) => {
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            setError("Permiso denegado para obtener tu ubicación.");
            break;
          case geoError.POSITION_UNAVAILABLE:
            setError("Posición no disponible en este momento.");
            break;
          case geoError.TIMEOUT:
            setError("Tiempo agotado al solicitar ubicación.");
            break;
          default:
            setError("Ocurrió un error al obtener la ubicación.");
        }
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }, []);

  return { location, error, isLoading, requestLocation, clearLocationError };
};

export default useBrowserGeolocation;
