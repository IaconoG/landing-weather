/* Clamps a number between a minimum and maximum value. */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/* Aggregates an array of numeric values, calculating the maximum, minimum, and average.
 * - Returns an object containing the results of the aggregation, including a flag indicating whether valid data was present.
 * - Filters out undefined values before performing calculations to ensure accurate results.
 * - If no valid numbers are present, returns an object with hasData set to false and all values as null.
 * */
type AggregationResult = {
  hasData: boolean;
  maxValue: number | null;
  minValue: number | null;
  avgValue: number | null;
};

export const aggregateNumericValues = (
  values: (number | undefined)[],
): AggregationResult => {
  const filtered = values.filter((v): v is number => v !== undefined);

  if (!filtered.length) {
    return {
      hasData: false,
      maxValue: null,
      minValue: null,
      avgValue: null,
    };
  }

  return {
    hasData: true,
    maxValue: Math.max(...filtered),
    minValue: Math.min(...filtered),
    avgValue: filtered.reduce((a, b) => a + b, 0) / filtered.length,
  };
};
