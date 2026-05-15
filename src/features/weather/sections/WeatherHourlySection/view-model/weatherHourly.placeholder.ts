import { getDayKey, getRelativeDayLabel } from "../../../utils/date";
import {
  formatDate,
  formatHour,
  formatWeekday,
} from "../../../utils/formatters";
import type { WeatherHourlySource } from "./weatherHourly.source.types";
import {
  HOURLY_DISPLAY_LIMIT,
  HOURLY_GRID_DAYS,
  type HourlyDayViewModel,
} from "./weatherHourly.types";

export const PLACEHOLDER_HOURLY_VIEW_MODEL: HourlyDayViewModel[] = Array.from(
  { length: HOURLY_GRID_DAYS },
  (_, index) => {
    const dayDate = new Date();
    dayDate.setDate(dayDate.getDate() + index);

    const dayKey = getDayKey(dayDate);
    const weekdayLabel = formatWeekday(dayDate);
    const dateLabel = formatDate(dayDate);
    const ariaDayLabel = `${weekdayLabel} ${dateLabel}`;
    const relativeDayLabel = getRelativeDayLabel(dayDate);
    const displayDayLabel =
      relativeDayLabel !== "none" ? relativeDayLabel : weekdayLabel;

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
      hours: PLACEHOLDER_HOURLY_HOURR_VIEW_MODEL,
    };
  },
);

export const PLACEHOLDER_HOURLY_HOURR_VIEW_MODEL: WeatherHourlySource[] =
  Array.from({ length: HOURLY_DISPLAY_LIMIT }, (_, index) => {
    const hour = index;
    const timestamp = new Date();
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
