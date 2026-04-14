/**
 * Converts a value to a number.
 * @param value - An optional object containing a number value.
 * @returns The number value or 0 if not provided.
 */
export const toNumber = (value?: { value: number }): number =>
  value?.value ?? 0;

/**
 * Converts a value to a timestamp in milliseconds.
 * @param value - An optional object containing a Date value.
 * @returns The timestamp in milliseconds.
 */
export const toTimestamp = (value?: { value: Date }): number =>
  value?.value instanceof Date ? value.value.getTime() : Date.now();

/**
 * Calculates the timezone offset in seconds for a given timezone and reference timestamp.
 * @param timezone - The timezone for which to calculate the offset.
 * @param referenceTimestampMs - The timestamp (in milliseconds) for which to calculate the offset.
 * @returns The offset in seconds.
 */
export const getTimeZoneOffsetSeconds = (
  timezone: string,
  referenceTimestampMs: number,
): number => {
  const date = new Date(referenceTimestampMs);

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  const zonedAsUtcMs = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second),
  );

  return Math.round((zonedAsUtcMs - referenceTimestampMs) / 1000);
};

/**
 * Validates if cached data is still valid based on TTL expiration time.
 * Returns true if cache is valid (now < expiresAt), false if expired.
 * @param expiresAt - The timestamp (in milliseconds) when the cache expires, or null if no cache.
 * @return boolean indicating if the cache is still valid.
 */
export const isCacheValid = (expiresAt: number | null): boolean => {
  if (expiresAt === null) return false;
  return Date.now() < expiresAt;
};
