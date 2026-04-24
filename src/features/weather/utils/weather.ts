import type { WmoWeatherCode } from "../../../types/weather.types";

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
