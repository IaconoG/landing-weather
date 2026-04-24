const DAY_MS = 86400000; // Number of milliseconds in a day
export type RelativeDayLabel = "Hoy" | "Mañana" | "Ayer" | "none";

/* Converts a Date object to a timestamp representing the start of that day (00:00:00). */
export const toStartOfDayTimestamp = (value: Date): number => {
  return new Date(
    value.getFullYear(),
    value.getMonth(),
    value.getDate(),
  ).getTime();
};

/* Gets a relative day label ("Hoy", "Ayer", "Mañana", or "none") based on the given date. */
export const getRelativeDayLabel = (date: Date): RelativeDayLabel => {
  const today = toStartOfDayTimestamp(new Date());
  const target = toStartOfDayTimestamp(date);

  if (target === today) return "Hoy";
  if (target === today - DAY_MS) return "Ayer";
  if (target === today + DAY_MS) return "Mañana";
  return "none";
};

/* Generates a unique key for a given date in the format "YYYY-MM-DD". */
export const getDayKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
