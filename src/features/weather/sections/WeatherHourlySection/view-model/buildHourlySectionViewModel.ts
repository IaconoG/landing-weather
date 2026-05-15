import type { HourlyForecastItem } from "../../../../../types/weather.types";
import {
  getDayKey,
  getRelativeDayLabel,
  toStartOfDayTimestamp,
} from "../../../utils/date";
import {
  formatDate,
  formatTemperature,
  formatWeekday,
} from "../../../utils/formatters";
import { aggregateNumericValues } from "../../../utils/math";
import { getWeatherIconLabel } from "../../../utils/weather";
import {
  buildWeatherHourlySource,
  buildPlaceholderHourSource,
} from "./weatherHourly.source.builder";
import {
  HOURLY_DISPLAY_LIMIT,
  HOURLY_GRID_DAYS,
  type HourlyDayViewModel,
  type HourlySectionViewModel,
} from "./weatherHourly.types";

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
          hours: buildPlaceholderHourSource(dayDate, HOURLY_DISPLAY_LIMIT, 0),
        };
      }

      const temperature = aggregateNumericValues(
        limitedHours.map((h) => h.temperature),
      );
      const maxTemperature = temperature.maxValue ?? 0;
      const minTemperature = temperature.minValue ?? 0;

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
        hours: buildWeatherHourlySource(limitedHours, dayDate),
      };
    },
  );

  return { days };
};
