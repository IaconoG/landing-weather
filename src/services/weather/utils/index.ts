export const toNumber = (value?: { value: number }): number =>
  value?.value ?? 0;

export const toTimestamp = (value?: { value: Date }): number =>
  value?.value instanceof Date ? value.value.getTime() : Date.now();

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
