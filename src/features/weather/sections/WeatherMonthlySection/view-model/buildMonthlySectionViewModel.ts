import type { MonthlyForecastItem } from "../../../../../types/weather.types";

type RelativeDayLabel = "Hoy" | "Mañana" | "Ayer" | "none";
const DAY_MS = 86400000;
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

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
  }).format(date);
};

const formatDay = (date: Date): string => {
  const raw = new Intl.DateTimeFormat("es-AR", {
    weekday: "short",
  }).format(date);
  const normalized = raw.replace(".", "");
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const getRelativeDayLabel = (date: Date): RelativeDayLabel => {
  const toStartOfDay = (value: Date): number => {
    return new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate(),
    ).getTime();
  };
  const today = toStartOfDay(new Date());
  const target = toStartOfDay(date);

  if (target === today) return "Hoy";
  if (target === today - DAY_MS) return "Ayer";
  if (target === today + DAY_MS) return "Mañana";
  return "none";
};

const formatTemperature = (value: number): string => {
  return String(`${Math.round(value)}°C`);
};

const toStartOfDayTimestamp = (value: Date): number => {
  return new Date(
    value.getFullYear(),
    value.getMonth(),
    value.getDate(),
  ).getTime();
};

const isValidForecastItem = (item: MonthlyForecastItem): boolean => {
  return (
    Number.isFinite(item.dateTimestamp) &&
    Number.isFinite(item.maxTemperature) &&
    Number.isFinite(item.minTemperature)
  );
};

const isOutsideCurrentMonth = (date: Date, reference: Date): boolean => {
  return date.getMonth() !== reference.getMonth();
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

  const validItemsByDay = new Map<number, MonthlyForecastItem>();
  for (const item of data) {
    if (!isValidForecastItem(item)) {
      continue;
    }

    const itemDate = new Date(item.dateTimestamp);
    validItemsByDay.set(toStartOfDayTimestamp(itemDate), item);
  }

  return {
    days: Array.from({ length: MONTHLY_GRID_DAYS }, (_, index) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);

      const dayTimestamp = toStartOfDayTimestamp(date);
      const item = validItemsByDay.get(dayTimestamp);
      const hasData = Boolean(item);

      const relativeDayLabel = getRelativeDayLabel(date);
      const displayDayLabel =
        relativeDayLabel !== "none" ? relativeDayLabel : formatDay(date);

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
        isOutsideCurrentMonth: isOutsideCurrentMonth(date, currentMonth),
        isToday: dayTimestamp === toStartOfDayTimestamp(new Date()),
      };
    }),
  };
};

export type { MonthlyDayViewModel, MonthlySectionViewModel };
