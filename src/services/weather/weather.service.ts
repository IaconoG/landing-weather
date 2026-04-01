import { 
  fetchWeather, 
  type FetchError,
  type StructureWeatherData, 
} from "@i-giann/open-meteo-wrapper";
import { CURRENT_HOURLY_PARAMS } from "../../constants/weather.query";
import type { CurrentWeatherResult } from "../../types/weather.types";
import { mapToCurrentWeather } from "./weather.mapper";


export type GetCurrentWeatherParams = {
  latitude: number;
  longitude: number;
  timezone?: string;  
}

const isWrapperError = (response: StructureWeatherData | FetchError): response is FetchError => {
  return 'errorType' in response;
}

export class WeatherService {

  getCurrentWeather  = async (params: GetCurrentWeatherParams): Promise<CurrentWeatherResult> => {
    const fetchedAt = Date.now();

    try {
      const response = await fetchWeather({
        latitude: params.latitude,
        longitude: params.longitude,
        timezone: params.timezone ?? 'auto',
        hourly: CURRENT_HOURLY_PARAMS,
        past_days: 0,
        forecast_days: 1,
      });

      if (isWrapperError(response)) {
        return {
          data: null,
          error: {
            message: response.error || 'Error al obtener los datos meteorológicos',
            type: response.errorType,
            timestamp: new Date(fetchedAt),
          },
          fetchedAt,
        }
      }

      return {
        data: mapToCurrentWeather(response),
        error: null,
        fetchedAt,
      }
    } catch (error: unknown) {
      const message = error instanceof Error 
        ? error.message
        : 'Error inesperado al consultar el clima';
        
      return {
        data: null,
        error: {
          message,
          type: undefined,
          timestamp: new Date(fetchedAt),
        },
        fetchedAt,
      }
    }
  }
}

export const weatherService = new WeatherService();

