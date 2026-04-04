import type { ErrorType } from "@i-giann/open-meteo-wrapper";

/**
 * Clima simplificado para UI
 */
export type CurrentWeather = {
  temperature: number;           // °C
  feelsLike: number;             // °C
  humidity: number;              // %
  weatherDescription: string;    // 'Clear sky', 'Partly cloudy', etc.
  windSpeed: number;             // km/h
  pressure: number;              // hPa
  visibility: number;            // km
  uv: number;                    // UV index
  timestamp: number;             // Unix timestamp of the weather data
};

/**
 * Estado de carga de datos
 */
export type WeatherState = "idle" | "loading" | "success" | "error";

/**
 * Error simplificado para UI
 */
export type WeatherError = {
  message: string;
  type?: ErrorType;
  timestamp: Date;
};

/**
 * Mapeo de codigo WMO a descripcion
 */
export type WeatherCodeMap = {
  [key: number]: string;
};

/**
 * Resultado de la consulta de clima actual
 */
export type CurrentWeatherResult = {
  data: CurrentWeather | null;
  error: WeatherError | null;
  fetchedAt: number;
};