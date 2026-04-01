import type { StructureWeatherData,  HourlyWeatherData } from "@i-giann/open-meteo-wrapper"
import type { CurrentWeather } from "../../types/weather.types"


const toNumber = (value?: {value: number}): number => value?.value ?? 0;

const toTimestamp = (value?: {value: Date}): number =>
  value?.value instanceof Date ? value.value.getTime() : Date.now();

export const mapToCurrentWeather = (data: StructureWeatherData): CurrentWeather => { 
  const firstHour: HourlyWeatherData | undefined = data.currentDay?.hourly?.[0];

  const weatherDescription = firstHour?.weatherDescription?.value ?? 'Condición desconocida'

  return {
    temperature: toNumber(firstHour?.temperature),
    feelsLike: toNumber(firstHour?.apparentTemperature),
    humidity: toNumber(firstHour?.relativeHumidity),
    weatherDescription,
    windSpeed: toNumber(firstHour?.wind?.speed),
    pressure: toNumber(firstHour?.pressureMsl),
    visibility: toNumber(firstHour?.visibility),
    uv: toNumber(firstHour?.uv) ?? 0,
    timestamp: toTimestamp(firstHour?.hour),
  }
}