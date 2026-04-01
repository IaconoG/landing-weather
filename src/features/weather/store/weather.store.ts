import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { CurrentWeather, WeatherError } from '../../../types/weather.types';

interface WeatherState {
  latitude: number | null;
  longitude: number | null;
  currentWeather: CurrentWeather | null; 
  isWeatherLoading: boolean;
  weatherError: WeatherError | null;
}

interface WeatherActions {
  setLocation: (latitude: number, longitude: number) => void;
  setCurrentWeather: (weatherData: CurrentWeather | null) => void;
  setIsWeatherLoading: (isWeatherLoading: boolean) => void;
  setWeatherError: (weatherError: WeatherError | null) => void;
}

export const useWeatherStore = create<WeatherState & WeatherActions>()(
  persist(
    (set) => ({
      latitude: null,
      longitude: null,
      currentWeather: null,
      weatherError: null,
      isWeatherLoading: false,

      setLocation: (latitude, longitude) => 
        set({
          latitude,
          longitude,
          currentWeather: null,
          weatherError: null,
          isWeatherLoading: true,
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
      }),
    }
  )
);
