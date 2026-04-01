import { create } from 'zustand';

import type { CurrentWeather, WeatherError } from '../../../types/weather.types';

interface WeatherState {
  latitude: number | null;
  longitude: number | null;
  currentWeather: CurrentWeather | null; 
  isLoading: boolean;
  error: WeatherError | null;
}

interface WeatherActions {
  setLocation: (latitude: number, longitude: number) => void;
  setCurrentWeather: (weatherData: CurrentWeather | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: WeatherError | null) => void;
}



export const useWeatherStore = create<WeatherState & WeatherActions>((set) => ({
  latitude: null,
  longitude: null,
  currentWeather: null,
  isLoading: false,
  error: null,


  setLocation: (latitude, longitude) => set({ latitude, longitude }),
  setCurrentWeather: (weatherData) => set({ currentWeather: weatherData }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

}));
