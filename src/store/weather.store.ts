import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  CurrentWeather,
  HourlyForecastItem,
  WeatherError,
  WeeklyForecastItem,
} from "../types/weather.types";

import type { LocationSource, SelectedLocation } from "../types/location.types";

interface WeatherState {
  latitude: number | null;
  longitude: number | null;
  locationLabel: string | null;
  locationSource: LocationSource | null;
  recentLocations: SelectedLocation[];

  // Current weather
  currentWeather: CurrentWeather | null;
  isCurrentLoading: boolean;
  currentError: WeatherError | null;
  currentFetchedAt: number | null;
  currentExpiresAt: number | null;

  // Hourly forecast
  hourlyForecast: HourlyForecastItem[] | null;
  isHourlyLoading: boolean;
  hourlyError: WeatherError | null;
  hourlyFetchedAt: number | null;
  hourlyExpiresAt: number | null;

  // Weekly forecast data and status
  weeklyForecast: WeeklyForecastItem[] | null;
  isWeeklyLoading: boolean;
  weeklyError: WeatherError | null;
  weeklyFetchedAt: number | null;
  weeklyExpiresAt: number | null;
}

interface WeatherActions {
  setLocation: (location: SelectedLocation) => void;
  clearLocation: () => void;

  // Current weather actions
  setCurrentWeather: (weatherData: CurrentWeather | null) => void;
  setIsCurrentLoading: (isCurrentLoading: boolean) => void;
  setCurrentError: (currentError: WeatherError | null) => void;
  setCurrentMeta: (fetchedAt: number, expiresAt: number) => void;

  // Hourly forecast actions
  setHourlyForecast: (hourlyData: HourlyForecastItem[] | null) => void;
  setIsHourlyLoading: (isHourlyLoading: boolean) => void;
  setHourlyError: (hourlyError: WeatherError | null) => void;
  setHourlyMeta: (fetchedAt: number, expiresAt: number) => void;

  // Weekly forecast actions
  setWeeklyForecast: (weeklyData: WeeklyForecastItem[] | null) => void;
  setIsWeeklyLoading: (isWeeklyLoading: boolean) => void;
  setWeeklyError: (weeklyError: WeatherError | null) => void;
  setWeeklyMeta: (fetchedAt: number, expiresAt: number) => void;
}

export const useWeatherStore = create<WeatherState & WeatherActions>()(
  persist(
    (set) => ({
      latitude: null,
      longitude: null,
      locationLabel: null,
      locationSource: null,
      recentLocations: [],

      // Current weather state
      currentWeather: null,
      isCurrentLoading: false,
      currentError: null,
      currentFetchedAt: null,
      currentExpiresAt: null,

      // Hourly forecast state
      hourlyForecast: null,
      isHourlyLoading: false,
      hourlyError: null,
      hourlyFetchedAt: null,
      hourlyExpiresAt: null,

      // Weekly forecast state
      weeklyForecast: null,
      isWeeklyLoading: false,
      weeklyError: null,
      weeklyFetchedAt: null,
      weeklyExpiresAt: null,

      setLocation: (location) =>
        set((state) => {
          const withoutCurrent = state.recentLocations.filter(
            (item) =>
              item.latitude !== location.latitude ||
              item.longitude !== location.longitude,
          );

          const recentLocations = [location, ...withoutCurrent].slice(0, 3);

          return {
            latitude: location.latitude,
            longitude: location.longitude,
            locationLabel: location.label,
            locationSource: location.source,
            recentLocations,

            currentWeather: null,
            isCurrentLoading: true,
            currentError: null,
            currentFetchedAt: null,
            currentExpiresAt: null,

            hourlyForecast: null,
            isHourlyLoading: false,
            hourlyError: null,
            hourlyFetchedAt: null,
            hourlyExpiresAt: null,

            weeklyForecast: null,
            isWeeklyLoading: false,
            weeklyError: null,
            weeklyFetchedAt: null,
            weeklyExpiresAt: null,
          };
        }),
      clearLocation: () =>
        set({
          latitude: null,
          longitude: null,
          locationLabel: null,
          locationSource: null,

          currentWeather: null,
          isCurrentLoading: false,
          currentError: null,
          currentFetchedAt: null,
          currentExpiresAt: null,

          hourlyForecast: null,
          isHourlyLoading: false,
          hourlyError: null,
          hourlyFetchedAt: null,
          hourlyExpiresAt: null,

          weeklyForecast: null,
          isWeeklyLoading: false,
          weeklyError: null,
          weeklyFetchedAt: null,
          weeklyExpiresAt: null,
        }),
      // Current weather actions
      setCurrentWeather: (weatherData) => set({ currentWeather: weatherData }),
      setIsCurrentLoading: (isCurrentLoading) => set({ isCurrentLoading }),
      setCurrentError: (currentError) => set({ currentError }),
      setCurrentMeta: (fetchedAt, expiresAt) =>
        set({ currentFetchedAt: fetchedAt, currentExpiresAt: expiresAt }),
      // Hourly forecast actions
      setHourlyForecast: (hourlyData) => set({ hourlyForecast: hourlyData }),
      setIsHourlyLoading: (isHourlyLoading) => set({ isHourlyLoading }),
      setHourlyError: (hourlyError) => set({ hourlyError }),
      setHourlyMeta: (fetchedAt, expiresAt) =>
        set({ hourlyFetchedAt: fetchedAt, hourlyExpiresAt: expiresAt }),
      // Weekly forecast actions
      setWeeklyForecast: (weeklyData) => set({ weeklyForecast: weeklyData }),
      setIsWeeklyLoading: (isWeeklyLoading) => set({ isWeeklyLoading }),
      setWeeklyError: (weeklyError) => set({ weeklyError }),
      setWeeklyMeta: (fetchedAt, expiresAt) =>
        set({ weeklyFetchedAt: fetchedAt, weeklyExpiresAt: expiresAt }),
    }),
    {
      name: "weather-storage",
      partialize: (state) => ({
        latitude: state.latitude,
        longitude: state.longitude,
        locationLabel: state.locationLabel,
        locationSource: state.locationSource,
        recentLocations: state.recentLocations,
      }),
    },
  ),
);
