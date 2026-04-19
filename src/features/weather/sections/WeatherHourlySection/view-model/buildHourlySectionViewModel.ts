import type {
  HourlyForecastItem,
  WmoWeatherCode,
} from "../../../../../types/weather.types";

type HourEntryViewModel = {
  id: string;
  timeLabel: string;
  temperatureLabel: string;
  feelsLikeLabel: string;
  temperatureOffset: number;
  feelsLikeOffset: number;
  precipitationLabel: string;
  hasPrecipitationData: boolean;
};

type RelativeDayLabel = "Hoy" | "Mañana" | "Ayer" | "none";
const DAY_MS = 86400000;

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
  hours: HourEntryViewModel[];
};

type HourlySectionViewModel = {
  days: HourlyDayViewModel[];
};

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

const formatWeekday = (date: Date): string => {
  const raw = new Intl.DateTimeFormat("es-AR", { weekday: "short" }).format(
    date,
  );

  const normalized = raw.replace(".", "");
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
  }).format(date);
};

const formatHour = (date: Date): string => {
  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
};

const formatTemperature = (value: number): string => {
  return `${Math.round(value)}°C`;
};

const getWeatherIconLabel = (weatherCode: WmoWeatherCode): string => {
  if (weatherCode >= 95) return "storm";
  if (weatherCode >= 80) return "shower";
  if (weatherCode >= 71) return "snow";
  if (weatherCode >= 61) return "rain";
  if (weatherCode >= 51) return "drizzle";
  if (weatherCode >= 45) return "fog";
  if (weatherCode >= 2) return "cloud";
  return "sun";
};

const getDayKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

const buildHourEntries = (
  hours: HourlyForecastItem[],
): HourEntryViewModel[] => {
  const temperatures = hours.map((hour) => hour.temperature);
  const feelsLikeValues = hours.map((hour) => hour.feelsLike);

  const minTemperature = Math.min(...temperatures);
  const maxTemperature = Math.max(...temperatures);
  const minFeelsLike = Math.min(...feelsLikeValues);
  const maxFeelsLike = Math.max(...feelsLikeValues);

  const temperatureRange = maxTemperature - minTemperature || 1;
  const feelsLikeRange = maxFeelsLike - minFeelsLike || 1;

  return hours.map((hour) => {
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
    };
  });
};

const buildPrecipitationSummary = (hours: HourlyForecastItem[]): string => {
  const values = hours
    .map((hour) => hour.precipitationProbability)
    .filter((value): value is number => value !== undefined);

  if (!values.length) return "Sin datos de precipitacion";

  const max = Math.max(...values);
  return `Maximo ${Math.round(max)}%`;
};

export const buildHourlySectionViewModel = (
  data: HourlyForecastItem[],
): HourlySectionViewModel => {
  if (!data.length) {
    return { days: [] };
  }

  const orderedData = [...data].sort((a, b) => a.timestamp - b.timestamp);
  const groupedByDay = new Map<string, HourlyForecastItem[]>();

  for (const item of orderedData) {
    const date = new Date(item.timestamp);
    const dayKey = getDayKey(date);
    const currentItems = groupedByDay.get(dayKey) ?? [];
    currentItems.push(item);
    groupedByDay.set(dayKey, currentItems);
  }

  const days: HourlyDayViewModel[] = Array.from(groupedByDay.entries()).map(
    ([dayKey, hours]) => {
      const dayDate = new Date(hours[0].timestamp);
      const minTemperature = Math.min(...hours.map((hour) => hour.temperature));
      const maxTemperature = Math.max(...hours.map((hour) => hour.temperature));
      const representativeHour =
        hours.find((hour) => hour.weatherCode !== undefined) ?? hours[0];

      const limitedHours = hours.slice(0, 12);

      const relativeDayLabel = getRelativeDayLabel(dayDate);

      return {
        id: dayKey,
        weekdayLabel: formatWeekday(dayDate),
        dateLabel: formatDate(dayDate),
        ariaDayLabel: `${formatWeekday(dayDate)} ${formatDate(dayDate)}`,
        relativeDayLabel: relativeDayLabel,
        displayDayLabel:
          relativeDayLabel !== "none" ? relativeDayLabel : formatDate(dayDate),
        iconLabel: getWeatherIconLabel(representativeHour.weatherCode),
        minTemperatureLabel: formatTemperature(minTemperature),
        maxTemperatureLabel: formatTemperature(maxTemperature),
        precipitationSummary: buildPrecipitationSummary(limitedHours),
        hours: buildHourEntries(limitedHours),
      };
    },
  );

  return { days };
};

export type { HourEntryViewModel, HourlyDayViewModel, HourlySectionViewModel };
