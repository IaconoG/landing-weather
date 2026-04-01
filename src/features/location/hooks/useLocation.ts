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
            setError('Permission denied. Please allow location access to get weather data.');
            break;
          case geoError.POSITION_UNAVAILABLE:
            setError('Position unavailable. Please try again later.');
            break;
          case geoError.TIMEOUT:
            setError('Location request timed out. Please try again.');
            break;
          default:
            setError('An unknown error occurred while fetching location.');
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