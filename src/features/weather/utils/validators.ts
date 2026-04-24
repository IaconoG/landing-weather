/* Validates if a given value is a finite number. */
export const isValidNumber = (value: unknown): value is number => {
  return Number.isFinite(value);
};
/* Validates if a given timestamp is a valid number. */
export const isValidForecastDate = (timestamp: number): boolean => {
  return isValidNumber(timestamp);
};

/* Checks if a given date falls outside the month of a reference date. */
export const isOutsideMonth = (date: Date, reference: Date): boolean => {
  return date.getMonth() !== reference.getMonth();
};
