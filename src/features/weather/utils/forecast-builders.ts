import { getDayKey } from "./date";

/* Groups an array of items by a day key derived from their timestamp. */
export const groupByDayKey = <T extends { timestamp: number }>(
  items: T[],
): Map<string, T[]> => {
  const grouped = new Map<string, T[]>();
  for (const item of items) {
    const key = getDayKey(new Date(item.timestamp));
    const current = grouped.get(key) ?? [];
    current.push(item);
    grouped.set(key, current);
  }
  return grouped;
};
