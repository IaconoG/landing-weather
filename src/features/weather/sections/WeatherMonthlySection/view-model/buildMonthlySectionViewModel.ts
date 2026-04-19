import type { MonthlyForecastItem } from "../../../../../types/weather.types";

type RelativeDayLabel = "Hoy" | "Mañana" | "Ayer" | "none";
const DAY_MS = 86400000;

type MonthlyDayViewModel = {
  id: string;
  dateLabel: string;
  dayLabel: string;
  relativeDayLabel: RelativeDayLabel;
  description: string;
  iconUrl?: string;
  maxTemperatureLabel: string;
  minTemperatureLabel: string;
  isToday: boolean;
  isOutsideCurrentMonth: boolean;
};

type MonthlySectionViewModel = {
  title: string;
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

const isOutsideCurrentMonth = (date: Date, reference: Date): boolean => {
  return date.getMonth() !== reference.getMonth();
};

export const buildMonthlySectionViewModel = (
  data: MonthlyForecastItem[],
): MonthlySectionViewModel => {
  const days = [...data]
    .sort((a, b) => a.dateTimestamp - b.dateTimestamp)
    .map((item) => {
      const date = new Date(item.dateTimestamp);
      const relativeDayLabel = getRelativeDayLabel(date);
      const displayDayLabel =
        relativeDayLabel !== "none" ? relativeDayLabel : formatDay(date);

      return {
        id: `${item.dateTimestamp}`,
        dateLabel: formatDate(date),
        dayLabel: displayDayLabel,
        relativeDayLabel,
        iconUrl: item.weatherIconUrl,
        description: item.weatherDescription ?? "Sin descripcion",
        maxTemperatureLabel: formatTemperature(item.maxTemperature),
        minTemperatureLabel: formatTemperature(item.minTemperature),
        isOutsideCurrentMonth: isOutsideCurrentMonth(date, new Date()),
        isToday: date.toDateString() === new Date().toDateString(),
      };
    });

  return {
    title: "Pronostico mensual",
    days,
  };
};

export type { MonthlyDayViewModel, MonthlySectionViewModel };
