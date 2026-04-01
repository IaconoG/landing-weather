import { useState, useCallback } from 'react';

export type BrowserLocation = {
  latitude: number;
  longitude: number;
}

type UseLocationResult = {
  location: BrowserLocation | null;
  error: string | null;
  isLoading: boolean;
  requestLocation: () => void;
  clearLocationError: () => void;
}

const useLocation = (): UseLocationResult => {
  const [location, setLocation] = useState<BrowserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clearLocationError = useCallback(() => {
    setError(null);
  }, []);

  const requestLocation = useCallback(() => {
    setError(null);

    if(!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
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
            setError('Permiso denegado. Por favor, permite el acceso a la ubicación para obtener los datos del clima.');
            break;
          case geoError.POSITION_UNAVAILABLE:
            setError('Posición no disponible. Por favor, inténtalo de nuevo más tarde.');
            break;
          case geoError.TIMEOUT:
            setError('Solicitud de ubicación agotada. Por favor, inténtalo de nuevo.');
            break;
          default:
            setError('Ocurrió un error desconocido al obtener la ubicación.');
        }
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    )
  }, []);

  return { location, error, isLoading, requestLocation, clearLocationError };
};

export default useLocation;