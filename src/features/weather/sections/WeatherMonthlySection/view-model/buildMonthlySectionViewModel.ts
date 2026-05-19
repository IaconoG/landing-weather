import type { MonthlyForecastItem } from "../../../../../types/weather.types";
import type {
  MonthlySectionViewModel,
  MonthlyDayViewModel,
} from "./weatherMonthly.types";
import {
  getRelativeDayLabel,
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
import {
  PLACEHOLDER_MONTHLY_VIEW_MODEL,
  DEFAULT_MONTHLY_DAY_VIEW_MODEL,
} from "./weatherMonthly.placeholder";

/* Build a map of processed and formatted items indexed by day timestamp */
type ProcessedMonthlyDay = Pick<
  MonthlyDayViewModel,
  | "id"
  | "maxTemperatureLabel"
  | "minTemperatureLabel"
  | "description"
  | "hasData"
>;

const buildProcessedItemsByDay = (
  data: MonthlyForecastItem[],
): Map<number, ProcessedMonthlyDay> => {
  const processed = new Map<number, ProcessedMonthlyDay>();

  for (const item of data) {
    if (!isValidForecastDate(item.dateTimestamp)) continue;

    const dayKey = toStartOfDayTimestamp(new Date(item.dateTimestamp));
    const hasMaxTemp = isValidNumber(item.maxTemperature.value);
    const hasMinTemp = isValidNumber(item.minTemperature.value);
    const hasAllRequiredData = hasMaxTemp && hasMinTemp;

    processed.set(dayKey, {
      id: `${dayKey}`,
      maxTemperatureLabel: hasMaxTemp
        ? `${formatTemperature(item.maxTemperature.value!)}`
        : DEFAULT_MONTHLY_DAY_VIEW_MODEL.maxTemperatureLabel,
      minTemperatureLabel: hasMinTemp
        ? `${formatTemperature(item.minTemperature.value!)}`
        : DEFAULT_MONTHLY_DAY_VIEW_MODEL.minTemperatureLabel,
      description: item.weatherDescription,
      hasData: hasAllRequiredData,
    });
  }

  return processed;
};

export const buildMonthlySectionViewModel = (
  data: MonthlyForecastItem[],
): MonthlySectionViewModel => {
  const currentMonth = new Date();

  if (data.length === 0) return PLACEHOLDER_MONTHLY_VIEW_MODEL;

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  );

  const startOffset = firstDayOfMonth.getDay();
  const gridStart = new Date(firstDayOfMonth);
  gridStart.setDate(firstDayOfMonth.getDate() - startOffset);

  const processedItems = buildProcessedItemsByDay(data);

  return {
    days: PLACEHOLDER_MONTHLY_VIEW_MODEL.days.map((placeholderDay, index) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);

      const dayTimestamp = toStartOfDayTimestamp(date);
      const processedData = processedItems.get(dayTimestamp);

      const relativeDayLabel = getRelativeDayLabel(date);
      const dayLabel =
        relativeDayLabel !== "none" ? relativeDayLabel : formatWeekday(date);
      const isToday = dayTimestamp === toStartOfDayTimestamp(new Date());

      /* Merge placeholder with real data if available */
      return {
        ...placeholderDay,
        ...(processedData || {}),
        id: `${dayTimestamp}`,
        dateLabel: formatDate(date),
        dayLabel,
        relativeDayLabel,
        isToday,
        isOutsideCurrentMonth: isOutsideMonth(date, currentMonth),
      };
    }),
  };
};
