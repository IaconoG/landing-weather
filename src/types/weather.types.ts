/**
 * Clima simplificado para UI
 */
export type CurrentWeather = {
  temperature: number           // °C
  feelsLike: number             // °C
  humidity: number              // %
  weatherCode: number           // Open-Meteo weather code
  weatherDescription: string    // 'Clear sky', 'Partly cloudy', etc.
  windSpeed: number             // m/s
  pressure: number              // hPa
  visibility: number            // m
  uv: number                    // UV index
  timestamp: number             // Unix timestamp of the weather data
}

/**
 * Estado de carga de datos
 */
export type WeatherState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Error simplificado para UI
 */
export type WeatherError = {
  message: string;
  code?: number;
  timestamp: Date; 
}

/**
 * Mapeo de codigo WMO a descripcion
 */
export type WeatherCodeMap = {
  [key: number]: string;
}