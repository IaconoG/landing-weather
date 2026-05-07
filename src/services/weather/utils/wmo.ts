import type {
  WeatherDescription,
  WmoWeatherCode,
} from "../../../types/weather.types";

const UNKNOWN_WEATHER_DESCRIPTION: WeatherDescription = "Condicion desconocida";

const WMO_DESCRIPTION_BY_CODE: Record<WmoWeatherCode, WeatherDescription> = {
  0: "Cielo despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Mayormente nublado",
  45: "Niebla",
  48: "Niebla con escarcha",
  51: "Llovizna ligera",
  53: "Llovizna moderada",
  55: "Llovizna densa",
  56: "Llovizna helada ligera",
  57: "Llovizna helada densa",
  61: "Lluvia ligera",
  63: "Lluvia moderada",
  65: "Lluvia intensa",
  66: "Lluvia helada ligera",
  67: "Lluvia helada intensa",
  71: "Nevada ligera",
  73: "Nevada moderada",
  75: "Nevada intensa",
  77: "Precipitación de granos de nieve",
  80: "Chubascos ligeros",
  81: "Chubascos moderados",
  82: "Chubascos violentos",
  85: "Chubascos de nieve ligeros",
  86: "Chubascos de nieve intensos",
  95: "Tormenta",
};

const WMO_CODES = new Set<WmoWeatherCode>(
  Object.keys(WMO_DESCRIPTION_BY_CODE).map(
    (code) => Number(code) as WmoWeatherCode,
  ),
);

export const isWmoWeatherCode = (value: number): value is WmoWeatherCode => {
  return WMO_CODES.has(value as WmoWeatherCode);
};

export const normalizeWmoWeatherCode = (
  weatherCode: number | undefined,
): WmoWeatherCode | undefined => {
  if (weatherCode === undefined) return undefined;
  return isWmoWeatherCode(weatherCode) ? weatherCode : undefined;
};

export const getWeatherDescriptionFromWmo = (
  weatherCode: number | undefined,
): WeatherDescription => {
  const normalizedCode = normalizeWmoWeatherCode(weatherCode);
  if (normalizedCode === undefined) return UNKNOWN_WEATHER_DESCRIPTION;

  return WMO_DESCRIPTION_BY_CODE[normalizedCode] ?? UNKNOWN_WEATHER_DESCRIPTION;
};
