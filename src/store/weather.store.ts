import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  CurrentWeather,
  WeatherError,
  HourlyForecastItem,
  WeeklyForecastItem,
  MonthlyForecastItem,
} from "../types/weather.types";

import type { LocationSource, SelectedLocation } from "../types/location.types";

type DataState<T> = {
  data: T | null;
  error: WeatherError | null;
  isLoading: boolean;
  fetchedAt: number | null;
  expiresAt: number | null;
  source?: "cache" | "network";
  stale?: boolean;
};

interface WeatherState {
  latitude: number | null;
  longitude: number | null;
  locationLabel: string | null;
  locationSource: LocationSource | null;
  recentLocations: SelectedLocation[];

  current: DataState<CurrentWeather>;
  hourly: DataState<HourlyForecastItem[]>;
  weekly: DataState<WeeklyForecastItem[]>;
  monthly: DataState<MonthlyForecastItem[]>;
}

interface WeatherActions {
  setLocation: (location: SelectedLocation) => void;
  clearLocations: () => void;

  setCurrentState: (next: Partial<DataState<CurrentWeather>>) => void;
  setHourlyState: (next: Partial<DataState<HourlyForecastItem[]>>) => void;
  setWeeklyState: (next: Partial<DataState<WeeklyForecastItem[]>>) => void;
  setMonthlyState: (next: Partial<DataState<MonthlyForecastItem[]>>) => void;
}

const emptyDataState = <T>(): DataState<T> => ({
  data: null,
  error: null,
  isLoading: false,
  fetchedAt: null,
  expiresAt: null,
  source: undefined,
  stale: undefined,
});

export const useWeatherStore = create<WeatherState & WeatherActions>()(
  persist(
    (set) => ({
      latitude: null,
      longitude: null,
      locationLabel: null,
      locationSource: null,
      recentLocations: [],

      // Current weather state
      current: {
        data: null,
        error: null,
        isLoading: false,
        fetchedAt: null,
        expiresAt: null,
      },

      hourly: {
        data: null,
        error: null,
        isLoading: false,
        fetchedAt: null,
        expiresAt: null,
      },

      weekly: {
        data: null,
        error: null,
        isLoading: false,
        fetchedAt: null,
        expiresAt: null,
      },

      monthly: {
        data: null,
        error: null,
        isLoading: false,
        fetchedAt: null,
        expiresAt: null,
      },

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

            current: emptyDataState<CurrentWeather>(),
            hourly: emptyDataState<HourlyForecastItem[]>(),
            weekly: emptyDataState<WeeklyForecastItem[]>(),
            monthly: emptyDataState<MonthlyForecastItem[]>(),
          };
        }),
      clearLocations: () =>
        set({
          latitude: null,
          longitude: null,
          locationLabel: null,
          locationSource: null,
          recentLocations: [],

          current: emptyDataState<CurrentWeather>(),
          hourly: emptyDataState<HourlyForecastItem[]>(),
          weekly: emptyDataState<WeeklyForecastItem[]>(),
          monthly: emptyDataState<MonthlyForecastItem[]>(),
        }),

      setCurrentState: (next) =>
        set((state) => ({ current: { ...state.current, ...next } })),
      setHourlyState: (next) =>
        set((state) => ({ hourly: { ...state.hourly, ...next } })),
      setWeeklyState: (next) =>
        set((state) => ({ weekly: { ...state.weekly, ...next } })),
      setMonthlyState: (next) =>
        set((state) => ({ monthly: { ...state.monthly, ...next } })),
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
