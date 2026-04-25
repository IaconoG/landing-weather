import { toStartOfDayTimestamp } from "../../../utils/date";
import { aggregateNumericValues } from "../../../utils/math";
import type {
  WeatherDetailsSectionData,
  WeatherDetailsSourceDay,
} from "./weatherDetails.source.types";

export const buildWeatherDetailsPlaceholderSourceDay =
  (): WeatherDetailsSourceDay => {
    const todayStart = toStartOfDayTimestamp(new Date());

    return {
      dateTimestamp: todayStart,
      temperatureMin: 0,
      temperatureMax: 0,
      hourly: [],
    };
  };

export const buildWeatherDetailsSourceDay = (
  data: WeatherDetailsSectionData,
): WeatherDetailsSourceDay | null => {
  const hourly = data.hourly;
  const weekly = data.weekly;

  if (!hourly || hourly.length === 0) return null;

  const orderedHours = [...hourly].sort((a, b) => a.timestamp - b.timestamp);
  const dayTimestamp = toStartOfDayTimestamp(
    new Date(orderedHours[0].timestamp),
  );

  const dayHours = orderedHours.filter(
    (item) => toStartOfDayTimestamp(new Date(item.timestamp)) === dayTimestamp,
  );

  if (dayHours.length === 0) return null;

  const weeklyDay =
    weekly?.find(
      (item) =>
        toStartOfDayTimestamp(new Date(item.dateTimestamp)) === dayTimestamp,
    ) ?? null;

  const tempAgg = aggregateNumericValues(dayHours.map((h) => h.temperature));

  return {
    dateTimestamp: dayTimestamp,
    sunriseTimestamp: weeklyDay?.sunriseTimestamp,
    sunsetTimestamp: weeklyDay?.sunsetTimestamp,
    daylightDurationSeconds: weeklyDay?.daylightDurationSeconds,
    temperatureMin: weeklyDay?.minTemperature ?? tempAgg.minValue ?? 0,
    temperatureMax: weeklyDay?.maxTemperature ?? tempAgg.maxValue ?? 0,
    weatherCode: weeklyDay?.weatherCode ?? dayHours[0].weatherCode,
    weatherDescription:
      weeklyDay?.weatherDescription ?? dayHours[0].weatherDescription,
    hourly: dayHours.map((h) => ({
      timestamp: h.timestamp,
      temperature: h.temperature,
      feelsLike: h.feelsLike,
      humidity: h.humidity,
      pressure: h.pressure,
      visibility: h.visibility,
      uv: h.uv,
      windSpeed: h.windSpeed,
      windDirection: h.windDirection,
      windGustSpeed: h.windGustSpeed,
      dewPoint: h.dewPoint,
      weatherCode: h.weatherCode,
      precipitationProbability: h.precipitationProbability,
    })),
  };
};
