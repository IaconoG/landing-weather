import { aggregateNumericValues } from "../../../utils/math";
import type {
  WeatherDetailsSource,
  WeatherDetailsSectionData,
} from "./weatherDetails.source.types";

export const buildWeatherDetailsSource = (
  day: WeatherDetailsSectionData,
): WeatherDetailsSource | null => {
  if (!day || !day.hourly.length) return null;

  const orderedHours = [...day.hourly].sort((a, b) => a.timestamp - b.timestamp);
  const fallbackTemperature = aggregateNumericValues(
    orderedHours.map((hour) => hour.temperature.value),
  );

  return {
    dateTimestamp: day.dateTimestamp,
    dateLabel: day.dateLabel,
    sunriseTimestamp: day.aggregates.sunriseTimestamp,
    sunsetTimestamp: day.aggregates.sunsetTimestamp,
    daylightDurationSeconds: day.aggregates.daylightDurationSeconds,
    temperatureMin:
      day.aggregates.minTemperature.value ?? fallbackTemperature.minValue ?? 0,
    temperatureMax:
      day.aggregates.maxTemperature.value ?? fallbackTemperature.maxValue ?? 0,
    weatherCode: orderedHours[0]?.weatherCode,
    weatherDescription: orderedHours[0]?.weatherDescription,
    hourly: orderedHours.map((hour) => ({
      timestamp: hour.timestamp,
      temperature: hour.temperature.value,
      feelsLike: hour.feelsLike.value,
      humidity: hour.humidity.value,
      pressure: hour.pressure.value,
      visibility: hour.visibility.value,
      uv: hour.uv.value,
      windSpeed: hour.wind.speed.value,
      windDirection: hour.wind.direction?.value,
      dewPoint: hour.dewPoint.value,
      weatherCode: hour.weatherCode,
      precipitationProbability: hour.precipitationProbability.value,
    })),
  };
};
