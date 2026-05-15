/* Formats a date to a string with the abbreviated weekday, e.g. "Lun", "Mar". */
export const formatWeekday = (date: Date): string => {
  const raw = new Intl.DateTimeFormat("es-AR", {
    weekday: "short",
  }).format(date);
  const normalized = raw.replace(".", "");
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

/* Formats a date to a string with the day of the month, e.g. "01", "23". */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
  }).format(date);
};

/* Formats a date to a string with the hour and minute, e.g. "14:30". */
export const formatTimeOrUnknown = (
  timestamp?: number,
  fallback: string = "-:-",
): string => {
  if (!timestamp) return fallback;
  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(timestamp));
};

/* Formats a date to a string with the hour and minute, e.g. "14:30". */
export const formatHour = (date: Date): string => {
  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
};

/* Formats a temperature value to a string with the degree symbol, e.g. "25°C". */
export const formatTemperature = (value: number): string => {
  return String(`${Math.round(value)}°C`);
};

/* Formats a duration given in a time unit to a string in the format "Xh Ym", e.g. "1h 30m". */
export const formatDuration = (
  value?: number,
  options?: {
    timeMeasure: "hour" | "minute" | "second";
  },
): string => {
  if (value === undefined) return "--";

  let totalMinutes: number;
  switch (options?.timeMeasure) {
    case "hour":
      totalMinutes = value * 60;
      break;
    case "minute":
      totalMinutes = value;
      break;
    case "second":
    default:
      totalMinutes = value / 60;
      break;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);

  const pad = (num: number) => String(num).padStart(2, "0");

  return `${pad(hours)}h ${pad(minutes)}m`;
};
