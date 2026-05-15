import { toStartOfDayTimestamp } from "../../../utils/date";
import { aggregateNumericValues } from "../../../utils/math";
import {
  getPressureTrend,
  getUvColorToken,
  getUvSeverity,
  getWindDirectionLabel,
} from "../../../utils/weather";
import { formatDuration, formatTimeOrUnknown } from "../../../utils/formatters";
import type { WeatherDetailsSource } from "./weatherDetails.source.types";
import type {
  WeatherDetailsDayViewModel,
  WeatherDetailsRangeMetric,
  WeatherDetailsSeriesPoint,
} from "./weatherDetails.types";

const toSeries = (
  items: WeatherDetailsSource["hourly"],
  pick: (item: WeatherDetailsSource["hourly"][number]) => number | undefined,
): WeatherDetailsSeriesPoint[] => {
  return items
    .map((item) => {
      const value = pick(item);
      if (value === undefined) return null;
      return {
        timestamp: item.timestamp,
        value,
      };
    })
    .filter((item): item is WeatherDetailsSeriesPoint => item !== null);
};

const resolveCurrentPointIndex = (
  points: WeatherDetailsSeriesPoint[],
  now: Date,
): number => {
  if (!points.length) return 0;

  const nowTs = now.getTime();
  let closestIndex = 0;
  let closestDelta = Math.abs(points[0].timestamp - nowTs);

  for (let index = 1; index < points.length; index += 1) {
    const delta = Math.abs(points[index].timestamp - nowTs);
    if (delta < closestDelta) {
      closestDelta = delta;
      closestIndex = index;
    }
  }

  return closestIndex;
};

const buildRangeMetric = (
  points: WeatherDetailsSeriesPoint[],
  now: Date,
): WeatherDetailsRangeMetric => {
  const agg = aggregateNumericValues(points.map((point) => point.value));

  if (!agg.hasData || agg.minValue === null || agg.maxValue === null) {
    return {
      currentValue: 0,
      currentPointIndex: 0,
      min: 0,
      max: 0,
      points: [],
    };
  }

  const currentPointIndex = resolveCurrentPointIndex(points, now);

  return {
    currentValue: points[currentPointIndex]?.value ?? points[0]?.value ?? 0,
    currentPointIndex,
    min: agg.minValue,
    max: agg.maxValue,
    points,
  };
};

export const buildDetailsSectionViewModel = (
  source: WeatherDetailsSource,
  now: Date = new Date(),
): WeatherDetailsDayViewModel => {
  const dayDate = new Date(source.dateTimestamp);
  const isToday =
    toStartOfDayTimestamp(dayDate) === toStartOfDayTimestamp(new Date());

  const temperaturePoints = toSeries(
    source.hourly,
    (point) => point.temperature,
  );
  const feelsLikePoints = toSeries(source.hourly, (point) => point.feelsLike);
  const pressurePoints = toSeries(source.hourly, (point) => point.pressure);
  const visibilityPoints = toSeries(source.hourly, (point) => point.visibility);
  const humidityPoints = toSeries(source.hourly, (point) => point.humidity);
  const dewPointPoints = toSeries(source.hourly, (point) => point.dewPoint);
  const windSpeedPoints = toSeries(source.hourly, (point) => point.windSpeed);
  const windDirectionPoints = toSeries(
    source.hourly,
    (point) => point.windDirection,
  );
  const uvPoints = toSeries(source.hourly, (point) => point.uv);
  const precipitationPoints = toSeries(
    source.hourly,
    (point) => point.precipitationProbability,
  );

  const temperatureRange = buildRangeMetric(temperaturePoints, now);
  const feelsLikeRange = buildRangeMetric(feelsLikePoints, now);
  const pressureRange = buildRangeMetric(pressurePoints, now);
  const pressureTrend = getPressureTrend(pressurePoints);
  const visibilityRange = buildRangeMetric(visibilityPoints, now);
  const humidityRange = buildRangeMetric(humidityPoints, now);
  const dewPointRange = buildRangeMetric(dewPointPoints, now);
  const windSpeedRange = buildRangeMetric(windSpeedPoints, now);
  const windDirectionRange = buildRangeMetric(windDirectionPoints, now);
  const windDirectionSymbols = windDirectionRange.points.map((point) =>
    getWindDirectionLabel(point.value),
  );
  const currentWindDirectionSymbol = getWindDirectionLabel(
    windDirectionRange.points[windDirectionRange.currentPointIndex]?.value,
  );
  const uvRange = buildRangeMetric(uvPoints, now);
  const uvSeveritys = uvRange.points.map((point) => getUvSeverity(point.value));
  const currentUvSeverity = getUvSeverity(uvRange.currentValue);
  const uvColorTokens = uvSeveritys.map((severity) =>
    getUvColorToken(severity),
  );
  const currentUvColorToken = getUvColorToken(currentUvSeverity);
  const precipitationRange = buildRangeMetric(precipitationPoints, now);

  const sun = {
    sunriseTimestamp: formatTimeOrUnknown(source.sunriseTimestamp),
    sunsetTimestamp: formatTimeOrUnknown(source.sunsetTimestamp),
    daylightDurationSeconds: formatDuration(source.daylightDurationSeconds, {
      timeMeasure: "hour",
    }),
  };
  // TODO: API not giving moon data for some reason, check later
  const moon = {
    moonriseTimestamp: formatTimeOrUnknown(source.moonriseTimestamp),
    moonsetTimestamp: formatTimeOrUnknown(source.moonsetTimestamp),
    illuminationPercentage: source.moonIllumination,
    phaseLabel: source.moonPhase ?? "Desconocida",
  };

  return {
    dateTimestamp: source.dateTimestamp,
    isToday,
    temperature: {
      ...temperatureRange,
      min: source.temperatureMin ?? temperatureRange.min,
      max: source.temperatureMax ?? temperatureRange.max,
    },
    feelsLike: feelsLikeRange,
    visibility: visibilityRange,
    humidity: {
      ...humidityRange,
      dewPoint: dewPointRange,
    },
    wind: {
      speed: windSpeedRange,
      direction: {
        ...windDirectionRange,
        directionSimbols: windDirectionSymbols,
        currentDirectionSymbol: currentWindDirectionSymbol,
      },
    },
    uv: {
      ...uvRange,
      severitys: uvSeveritys,
      currentSeverity: currentUvSeverity,
      colorTokens: uvColorTokens,
      currentColorToken: currentUvColorToken,
    },
    pressure: {
      ...pressureRange,
      trend: pressureTrend,
    },
    precipitation: precipitationRange,
    sun,
    moon,
  };
};
