import type { MonthlyForecastItem } from "../../../../../types/weather.types";
import {
  getRelativeDayLabel,
  type RelativeDayLabel,
  toStartOfDayTimestamp,
} from "../../../utils/date";
import {
  formatDate,
  formatTemperature,
  formatWeekday,
} from "../../../utils/formatters";
import {
  isOutsideMonth,
  isValidForecastDate,
  isValidNumber,
} from "../../../utils/validators";

const MONTHLY_GRID_DAYS = 35;

type MonthlyDayViewModel = {
  id: string;
  dateLabel: string;
  dayLabel: string;
  relativeDayLabel: RelativeDayLabel;
  hasData: boolean;
  description: string;
  iconUrl?: string;
  maxTemperatureLabel: string;
  minTemperatureLabel: string;
  isToday: boolean;
  isOutsideCurrentMonth: boolean;
};

type MonthlySectionViewModel = {
  days: MonthlyDayViewModel[];
};

const buildValidItemsByDay = (
  data: MonthlyForecastItem[],
): Map<number, MonthlyForecastItem> => {
  const validItemsByDay = new Map<number, MonthlyForecastItem>();
  for (const item of data) {
    if (
      !isValidForecastDate(item.dateTimestamp) ||
      !isValidNumber(item.maxTemperature) ||
      !isValidNumber(item.minTemperature)
    ) {
      continue;
    }

    const itemDate = new Date(item.dateTimestamp);
    validItemsByDay.set(toStartOfDayTimestamp(itemDate), item);
  }
  return validItemsByDay;
};

export const buildMonthlySectionViewModel = (
  data: MonthlyForecastItem[],
): MonthlySectionViewModel => {
  const currentMonth = new Date();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  );

  const startOffset = firstDayOfMonth.getDay();
  const gridStart = new Date(firstDayOfMonth);
  gridStart.setDate(firstDayOfMonth.getDate() - startOffset);

  const validItemsByDay = buildValidItemsByDay(data);

  return {
    days: Array.from({ length: MONTHLY_GRID_DAYS }, (_, index) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);

      const dayTimestamp = toStartOfDayTimestamp(date);
      const item = validItemsByDay.get(dayTimestamp);
      const hasData = Boolean(item);

      const relativeDayLabel = getRelativeDayLabel(date);
      const displayDayLabel =
        relativeDayLabel !== "none" ? relativeDayLabel : formatWeekday(date);

      return {
        id: `${dayTimestamp}`,
        dateLabel: formatDate(date),
        dayLabel: displayDayLabel,
        relativeDayLabel,
        hasData,
        iconUrl: hasData ? item?.weatherIconUrl : undefined,
        description:
          hasData && item?.weatherDescription
            ? item.weatherDescription
            : "Sin datos",
        maxTemperatureLabel:
          hasData && item ? formatTemperature(item.maxTemperature) : "--°C",
        minTemperatureLabel:
          hasData && item ? formatTemperature(item.minTemperature) : "--°C",
        isOutsideCurrentMonth: isOutsideMonth(date, currentMonth),
        isToday: dayTimestamp === toStartOfDayTimestamp(new Date()),
      };
    }),
  };
};

export type { MonthlyDayViewModel, MonthlySectionViewModel };
