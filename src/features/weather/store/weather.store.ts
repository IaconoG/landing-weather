import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { CurrentWeather, WeatherError } from '../../../types/weather.types';

import type { LocationSource, SelectedLocation } from '../../../types/location.types';

interface WeatherState {
  latitude: number | null;
  longitude: number | null;
  locationLabel: string | null;
  locationSource: LocationSource | null;
  recentLocations: SelectedLocation[];
  currentWeather: CurrentWeather | null; 
  isWeatherLoading: boolean;
  weatherError: WeatherError | null;
}

interface WeatherActions {
  setLocation: (location: SelectedLocation) => void;
  clearLocation: () => void;
  setCurrentWeather: (weatherData: CurrentWeather | null) => void;
  setIsWeatherLoading: (isWeatherLoading: boolean) => void;
  setWeatherError: (weatherError: WeatherError | null) => void;
}

export const useWeatherStore = create<WeatherState & WeatherActions>()(
  persist(
    (set) => ({
      latitude: null,
      longitude: null,
      locationLabel: null,
      locationSource: null,
      recentLocations: [],
      currentWeather: null,
      weatherError: null,
      isWeatherLoading: false,

      setLocation: (location) => 
        set((state) => {
          const withoutCurrent = state.recentLocations.filter(
            (item) => item.latitude !== location.latitude || item.longitude !== location.longitude
          );

          const recentLocations = [location, ...withoutCurrent].slice(0, 3);

          return {
            latitude: location.latitude,
            longitude: location.longitude,
            locationLabel: location.label,
            locationSource: location.source,
            recentLocations,
            currentWeather: null,
            weatherError: null,
            isWeatherLoading: true,
          };
        }),
      clearLocation: () =>
        set({
          latitude: null,
          longitude: null,
          locationLabel: null,
          locationSource: null,
          currentWeather: null,
          weatherError: null,
          isWeatherLoading: false,
        }),
      setCurrentWeather: (weatherData) => set({ currentWeather: weatherData }),
      setIsWeatherLoading: (isWeatherLoading) => set({ isWeatherLoading }),
      setWeatherError: (weatherError) => set({ weatherError }),
    }),
    {
      name: 'weather-storage',
      partialize: (state) => ({
        latitude: state.latitude,
        longitude: state.longitude,
        locationLabel: state.locationLabel,
        locationSource: state.locationSource,
        recentLocations: state.recentLocations,
      }),
    }
  )
);
