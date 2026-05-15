import type { HourlyForecastItem } from "../../../../../types/weather.types";
import { formatHour, formatTemperature } from "../../../utils/formatters";
import { aggregateNumericValues, clamp } from "../../../utils/math";
import type { WeatherHourlySource } from "./weatherHourly.source.types";
import { HOURLY_DISPLAY_LIMIT } from "./weatherHourly.types";

// /* Builds placeholder hour entries for a given day when no data is available. */
// export const buildPlaceholderHourSource = (
//   dayDate: Date,
//   count: number,
//   startHour: number,
// ): WeatherHourlySource[] => {
//   return Array.from({ length: count }, (_, index) => {
//     const hour = startHour + index;
//     const timestamp = new Date(dayDate);
//     timestamp.setHours(hour, 0, 0, 0);

//     return {
//       id: `${timestamp.getTime()}-placeholder-${hour}`,
//       timeLabel: formatHour(timestamp),
//       temperatureLabel: "--°C",
//       feelsLikeLabel: "--°C",
//       temperatureOffset: 50,
//       feelsLikeOffset: 50,
//       precipitationLabel: "Sin dato",
//       hasPrecipitationData: false,
//       hasData: false,
//     };
//   });
// };

/* Builds the view model for the hourly weather section based on the provided forecast data. */
export const buildWeatherHourlySource = (
  hours: HourlyForecastItem[],
): WeatherHourlySource[] => {
  const dayDate = hours.length > 0 ? new Date(hours[0].timestamp) : null;

  const temperatures = hours.map((hour) => hour.temperature);
  const feelsLikeValues = hours.map((hour) => hour.feelsLike);

  const tempAgg = aggregateNumericValues(temperatures);
  const minTemperature = tempAgg.minValue;
  const maxTemperature = tempAgg.maxValue;
  const feelsLikeAgg = aggregateNumericValues(feelsLikeValues);
  const minFeelsLike = feelsLikeAgg.minValue;
  const maxFeelsLike = feelsLikeAgg.maxValue;

  const temperatureRange = maxTemperature - minTemperature || 1;
  const feelsLikeRange = maxFeelsLike - minFeelsLike || 1;

  const realEntries: WeatherHourlySource[] = hours.map((hour) => {
    const timestamp = new Date(hour.timestamp);
    const precipitationProbability = hour.precipitationProbability;

    return {
      id: `${hour.timestamp}`,
      timeLabel: formatHour(timestamp),
      temperatureLabel: formatTemperature(hour.temperature),
      feelsLikeLabel: formatTemperature(hour.feelsLike),
      temperatureOffset: clamp(
        15 + ((hour.temperature - minTemperature) / temperatureRange) * 80,
        15,
        95,
      ),
      feelsLikeOffset: clamp(
        15 + ((hour.feelsLike - minFeelsLike) / feelsLikeRange) * 80,
        15,
        95,
      ),
      precipitationLabel:
        precipitationProbability === undefined
          ? "Sin dato"
          : `${Math.round(precipitationProbability)}%`,
      hasPrecipitationData: precipitationProbability !== undefined,
      hasData: true,
    };
  });

  if (realEntries.length >= HOURLY_DISPLAY_LIMIT) {
    return realEntries.slice(0, HOURLY_DISPLAY_LIMIT);
  }

  const placeholders = buildPlaceholderHourSource(
    dayDate,
    HOURLY_DISPLAY_LIMIT - realEntries.length,
    hours.length > 0
      ? new Date(hours[hours.length - 1].timestamp).getHours() + 1
      : 6,
  );

  return [...realEntries, ...placeholders];
};
