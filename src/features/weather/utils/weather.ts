import type { WmoWeatherCode } from "../../../types/weather.types";
import type {
  PressureTrend,
  WeatherDetailSeverity,
  WeatherDetailsSeriesPoint,
} from "../sections/WeatherDetailsSection/view-model/weatherDetails.types";

/* Maps WMO weather codes to human-readable icon labels. */
export const getWeatherIconLabel = (weatherCode: WmoWeatherCode): string => {
  if (weatherCode >= 95) return "storm";
  if (weatherCode >= 80) return "shower";
  if (weatherCode >= 71) return "snow";
  if (weatherCode >= 61) return "rain";
  if (weatherCode >= 51) return "drizzle";
  if (weatherCode >= 45) return "fog";
  if (weatherCode >= 2) return "cloud";
  return "sun";
};

/* Maps wind direction in degrees to compass directions. */
export const getWindDirectionLabel = (degrees?: number): string => {
  if (degrees === undefined) return "Desconocida";
  const normalized = ((degrees % 360) + 360) % 360;
  const sectors = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  const index = Math.round(normalized / 45) % 8;
  return sectors[index];
};

/* Maps UV index values to severity levels. */
export const getUvSeverity = (uv: number): WeatherDetailSeverity => {
  if (uv <= 2) return "low";
  if (uv <= 5) return "moderate";
  if (uv <= 7) return "high";
  if (uv <= 10) return "very_high";
  return "extreme";
};

/* Maps UV severity levels to color tokens for styling. */
export const getUvColorToken = (severity: WeatherDetailSeverity): string => {
  const bySeverity: Record<WeatherDetailSeverity, string> = {
    low: "var(--color-success)",
    moderate: "var(--color-warning)",
    high: "var(--color-warning-strong, #ff8a00)",
    very_high: "var(--color-danger)",
    extreme: "var(--color-danger-strong, #8b0000)",
  };
  return bySeverity[severity];
};

/**
 * Determines the pressure trend based on a series of pressure points.
 * - This is calculate by an interval of 3 hours,
 * - If the pressure has INCreased more than 1.5 hPa, it's "rising".
 * - If the pressure has DECreased more than 1.5 hPa, it's "falling".
 * - Otherwise, it's "steady".
 * The threshold of 1.5 hPa is a common standard for determining significant pressure changes in meteorology.
 */
export const getPressureTrend = (
  points: WeatherDetailsSeriesPoint[],
): PressureTrend => {
  if (points.length < 2) return "steady";
  const first = points[0].value;
  const last = points[points.length - 1].value;
  const delta = last - first;
  if (delta > 1.5) return "rising";
  if (delta < -1.5) return "falling";
  return "steady";
};
