import type { HourlyForecastItem } from "../../../../../types/weather.types";
import {
  getDayKey,
  getRelativeDayLabel,
  toStartOfDayTimestamp,
  type RelativeDayLabel,
} from "../../../utils/date";
import {
  formatDate,
  formatHour,
  formatTemperature,
  formatWeekday,
} from "../../../utils/formatters";
import { aggregateNumericValues, clamp } from "../../../utils/math";
import { getWeatherIconLabel } from "../../../utils/weather";

const HOURLY_DISPLAY_LIMIT = 12;
const HOURLY_GRID_DAYS = 7;

type HourEntryViewModel = {
  id: string;
  timeLabel: string;
  temperatureLabel: string;
  feelsLikeLabel: string;
  temperatureOffset: number;
  feelsLikeOffset: number;
  precipitationLabel: string;
  hasPrecipitationData: boolean;
  hasData: boolean;
};

type HourlyDayViewModel = {
  id: string;
  weekdayLabel: string;
  dateLabel: string;
  ariaDayLabel: string;
  relativeDayLabel: RelativeDayLabel;
  displayDayLabel: string;
  iconLabel: string;
  minTemperatureLabel: string;
  maxTemperatureLabel: string;
  precipitationSummary: string;
  hasData: boolean;
  hours: HourEntryViewModel[];
};

type HourlySectionViewModel = {
  days: HourlyDayViewModel[];
};

/* Builds placeholder hour entries for a given day when no data is available. */
const buildPlaceholderHourEntries = (
  dayDate: Date,
  count: number,
  startHour: number,
): HourEntryViewModel[] => {
  return Array.from({ length: count }, (_, index) => {
    const hour = startHour + index;
    const timestamp = new Date(dayDate);
    timestamp.setHours(hour, 0, 0, 0);

    return {
      id: `${timestamp.getTime()}-placeholder-${hour}`,
      timeLabel: formatHour(timestamp),
      temperatureLabel: "--°C",
      feelsLikeLabel: "--°C",
      temperatureOffset: 50,
      feelsLikeOffset: 50,
      precipitationLabel: "Sin dato",
      hasPrecipitationData: false,
      hasData: false,
    };
  });
};

/* Builds the view model for the hourly weather section based on the provided forecast data. */
const buildHourEntries = (
  hours: HourlyForecastItem[],
  dayDate: Date,
): HourEntryViewModel[] => {
  if (hours.length === 0 && dayDate) {
    // If there are no hours but we have a date, create placeholders for a typical day
    return buildPlaceholderHourEntries(dayDate, HOURLY_DISPLAY_LIMIT, 6);
  }

  const temperatures = hours.map((hour) => hour.temperature);
  const feelsLikeValues = hours.map((hour) => hour.feelsLike);

  const minTemperature = Math.min(...temperatures);
  const maxTemperature = Math.max(...temperatures);
  const minFeelsLike = Math.min(...feelsLikeValues);
  const maxFeelsLike = Math.max(...feelsLikeValues);

  const temperatureRange = maxTemperature - minTemperature || 1;
  const feelsLikeRange = maxFeelsLike - minFeelsLike || 1;

  const realEntries: HourEntryViewModel[] = hours.map((hour) => {
    const timestamp = new Date(hour.timestamp);
    const precipitationProbability = hour.precipitationProbability;

    return {
      id: `${hour.timestamp}`,
      timeLabel: formatHour(timestamp),
      temperatureLabel: formatTemperature(hour.temperature),
      feelsLikeLabel: formatTemperature(hour.feelsLike),
      temperatureOffset: clamp(
        15 + ((hour.temperature - minTemperature) / temperatureRange) * 80,
        15,
        95,
      ),
      feelsLikeOffset: clamp(
        15 + ((hour.feelsLike - minFeelsLike) / feelsLikeRange) * 80,
        15,
        95,
      ),
      precipitationLabel:
        precipitationProbability === undefined
          ? "Sin dato"
          : `${Math.round(precipitationProbability)}%`,
      hasPrecipitationData: precipitationProbability !== undefined,
      hasData: true,
    };
  });

  if (realEntries.length >= HOURLY_DISPLAY_LIMIT) {
    return realEntries.slice(0, HOURLY_DISPLAY_LIMIT);
  }

  const placeholders = buildPlaceholderHourEntries(
    dayDate,
    HOURLY_DISPLAY_LIMIT - realEntries.length,
    hours.length > 0
      ? new Date(hours[hours.length - 1].timestamp).getHours() + 1
      : 6,
  );

  return [...realEntries, ...placeholders];
};

/* Builds a summary string for precipitation probability based on the hourly data. */
const buildPrecipitationSummary = (items: HourlyForecastItem[]): string => {
  const agg = aggregateNumericValues(
    items.map((h) => h.precipitationProbability),
  );

  if (!agg.hasData) return "Sin datos de precipitacion";
  return `Maximo ${Math.round(agg.maxValue!)}%`;
};

/* Main function to build the hourly section view model from the raw hourly forecast data. */
export const buildHourlySectionViewModel = (
  data: HourlyForecastItem[],
): HourlySectionViewModel => {
  const orderedData = [...data].sort((a, b) => a.timestamp - b.timestamp);
  const groupedByDay = new Map<string, HourlyForecastItem[]>();

  for (const item of orderedData) {
    const dayKey = getDayKey(new Date(item.timestamp));
    const currentItems = groupedByDay.get(dayKey) ?? [];
    currentItems.push(item);
    groupedByDay.set(dayKey, currentItems);
  }

  const todayStart = new Date(toStartOfDayTimestamp(new Date()));

  const days: HourlyDayViewModel[] = Array.from(
    { length: HOURLY_GRID_DAYS },
    (_, index) => {
      const dayDate = new Date(todayStart);
      dayDate.setDate(todayStart.getDate() + index);

      const dayKey = getDayKey(dayDate);
      const dayItems = groupedByDay.get(dayKey) ?? [];
      const limitedHours = dayItems.slice(0, HOURLY_DISPLAY_LIMIT);
      const hasData = dayItems.length > 0;

      const weekdayLabel = formatWeekday(dayDate);
      const dateLabel = formatDate(dayDate);
      const ariaDayLabel = `${weekdayLabel} ${dateLabel}`;
      const relativeDayLabel = getRelativeDayLabel(dayDate);
      const displayDayLabel =
        relativeDayLabel !== "none" ? relativeDayLabel : weekdayLabel;

      if (!hasData) {
        return {
          id: dayKey,
          weekdayLabel,
          dateLabel,
          ariaDayLabel,
          relativeDayLabel,
          displayDayLabel,
          iconLabel: "cloud",
          minTemperatureLabel: "--°C",
          maxTemperatureLabel: "--°C",
          precipitationSummary: "Sin datos de precipitacion",
          hasData: false,
          hours: buildPlaceholderHourEntries(dayDate, HOURLY_DISPLAY_LIMIT, 0),
        };
      }

      const maxTemperature = Math.max(
        ...limitedHours.map((hour) => hour.temperature),
      );
      const minTemperature = Math.min(
        ...limitedHours.map((hour) => hour.temperature),
      );
      const representativeHour = limitedHours[0];

      return {
        id: dayKey,
        weekdayLabel,
        dateLabel,
        ariaDayLabel,
        relativeDayLabel,
        displayDayLabel,
        iconLabel: getWeatherIconLabel(representativeHour.weatherCode),
        minTemperatureLabel: formatTemperature(minTemperature),
        maxTemperatureLabel: formatTemperature(maxTemperature),
        precipitationSummary: buildPrecipitationSummary(dayItems),
        hasData: true,
        hours: buildHourEntries(limitedHours, dayDate),
      };
    },
  );

  return { days };
};

export type { HourEntryViewModel, HourlyDayViewModel, HourlySectionViewModel };
