import { toStartOfDayTimestamp } from "../../../utils/date";
import { aggregateNumericValues } from "../../../utils/math";
import {
  getUvSeverity,
  getWindDirectionLabel,
  getPressureTrend,
  getUvColorToken,
} from "../../../utils/weather";
import { formatDuration, formatTimeOrUnknown } from "../../../utils/formatters";
import type { WeatherDetailsSourceDay } from "./weatherDetails.source.types";
import type {
  WeatherDetailsRangeMetric,
  WeatherDetailsSeriesPoint,
  WeatherDetailsViewModel,
} from "./weatherDetails.types";

const toSeries = (
  items: WeatherDetailsSourceDay["hourly"],
  pick: (item: WeatherDetailsSourceDay["hourly"][number]) => number,
): WeatherDetailsSeriesPoint[] => {
  return items.map((item) => ({
    timestamp: item.timestamp,
    value: pick(item),
  }));
};

const buildRangeMetric = (
  points: WeatherDetailsSeriesPoint[],
): WeatherDetailsRangeMetric => {
  const agg = aggregateNumericValues(points.map((p) => p.value));

  if (!agg.hasData || agg.minValue === null || agg.maxValue === null) {
    return {
      current: 0,
      min: 0,
      max: 0,
      points: [],
    };
  }

  return {
    current: points[0]?.value ?? 0,
    min: agg.minValue,
    max: agg.maxValue,
    points,
  };
};

export const buildWeatherDetailsViewModel = (
  data: WeatherDetailsSourceDay,
): WeatherDetailsViewModel => {
  const dayDate = new Date(data.dateTimestamp);
  const isToday =
    toStartOfDayTimestamp(dayDate) === toStartOfDayTimestamp(new Date());

  const temperaturePoints = toSeries(data.hourly, (point) => point.temperature);
  const feelsLikePoints = toSeries(data.hourly, (point) => point.feelsLike);
  const pressurePoints = toSeries(data.hourly, (point) => point.pressure);
  const visibilityPoints = toSeries(data.hourly, (point) => point.visibility);
  const humidityPoints = toSeries(data.hourly, (point) => point.humidity);
  const windPoints = toSeries(data.hourly, (point) => point.windSpeed);
  const precipitationPoints = toSeries(
    data.hourly,
    (point) => point.precipitationProbability ?? 0,
  );
  const precipitationAgg = aggregateNumericValues(
    data.hourly.map((h) => h.precipitationProbability ?? 0),
  );
  const sunriseLabel = formatTimeOrUnknown(data.sunriseTimestamp);
  const sunsetLabel = formatTimeOrUnknown(data.sunsetTimestamp);
  const daylightLabel = formatDuration(data.daylightDurationSeconds);
  const moonriseLabel = formatTimeOrUnknown(data.moonriseTimestamp);
  const moonsetLabel = formatTimeOrUnknown(data.moonsetTimestamp);

  const firstHour = data.hourly[0];
  const uvValue = firstHour?.uv ?? 0;
  const uvSeverity = getUvSeverity(uvValue);

  return {
    day: {
      dateTimestamp: data.dateTimestamp,
      isToday,

      temperature: {
        ...buildRangeMetric(temperaturePoints),
        min: data.temperatureMin,
        max: data.temperatureMax,
      },
      feelsLike: buildRangeMetric(feelsLikePoints),
      visibility: buildRangeMetric(visibilityPoints),
      humidity: {
        relativeHumidity: firstHour?.humidity ?? 0,
        dewPoint: firstHour?.dewPoint,
        points: humidityPoints,
      },
      wind: {
        directionDegrees: firstHour?.windDirection,
        directionLabel: firstHour?.windDirection
          ? getWindDirectionLabel(firstHour.windDirection)
          : "Desconocida",
        speed: firstHour?.windSpeed ?? 0,
        gustSpeed: firstHour?.windGustSpeed,
        points: windPoints,
      },
      uv: {
        value: uvValue ?? 0,
        severity: uvSeverity,
        colorToken: getUvColorToken(uvSeverity),
      },
      pressure: {
        ...buildRangeMetric(pressurePoints),
        trend: getPressureTrend(pressurePoints),
      },
      precipitation: {
        probability: firstHour?.precipitationProbability ?? 0,
        maxProbability: precipitationAgg.maxValue ?? 0,
        points: precipitationPoints,
        hasData: precipitationAgg.hasData,
      },
      sun: {
        sunriseTimestamp: data.sunriseTimestamp ?? 0,
        sunsetTimestamp: data.sunsetTimestamp ?? 0,
        daylightDurationSeconds: data.daylightDurationSeconds ?? 0,
        sunriseLabel,
        sunsetLabel,
        daylightLabel,
      },
      moon: {
        phaseLabel: data.moonPhase ?? "Desconocida",
        illuminationPercentage: data.moonIllumination ?? 0,
        moonriseTimestamp: data.moonriseTimestamp,
        moonsetTimestamp: data.moonsetTimestamp,
        moonriseLabel,
        moonsetLabel,
        hasData:
          data.moonPhase !== undefined && data.moonIllumination !== undefined,
      },
    },
  };
};
