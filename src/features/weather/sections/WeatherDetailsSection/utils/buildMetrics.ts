import type { CurrentWeather } from "../../../../../types/weather.types";
import { METRIC_CONFIG, type Metric, type MetricKey } from "./metricConfig";

export const buildMetrics = (
  data: CurrentWeather,
  metricKeys?: MetricKey[],
): Metric[] => {
  const keys = metricKeys ?? (Object.keys(data) as MetricKey[]);

  return keys
    .filter((key) => key in METRIC_CONFIG)
    .map((key) => {
      const config = METRIC_CONFIG[key];
      const value = data[key];

      return {
        id: key,
        label: config.label,
        description: config.description,
        value: config.format(value),
      };
    });
};
