import type {
  StructureWeatherData,
  HourlyWeatherData,
  DailyWeatherData,
} from "@i-giann/open-meteo-wrapper";
import type {
  CurrentWeather,
  HourlyForecastItem,
  WeeklyForecastItem,
  MonthlyForecastItem,
} from "../../types/weather.types";
import { toTimestamp } from "./utils";
import {
  getWeatherDescriptionFromWmo,
  normalizeWmoWeatherCode,
} from "./utils/wmo";
import {
  DEFAULT_CURRENT_WEATHER,
  DAY_LABEL_FORMATTER,
  formatWeatherValue,
  formatWeatherUVValue,
  formatWeatherWind,
  makeValueUI,
  computeMin,
  computeMax,
  computeAvg,
} from "./weather.mapper.util";

const mapHourlyForDay = (day: DailyWeatherData): HourlyForecastItem[] => {
  const dayHours = day.hourly ?? [];

  return dayHours.map((hour) => {
    const weatherCode = normalizeWmoWeatherCode(hour?.weatherCode?.value);
    const weatherDescription = getWeatherDescriptionFromWmo(weatherCode);

    return {
      timestamp: toTimestamp(hour.hour),
      temperature: formatWeatherValue(hour?.temperature),
      humidity: formatWeatherValue(hour?.relativeHumidity),
      dewPoint: formatWeatherValue(hour?.dewPoint),
      feelsLike: formatWeatherValue(hour?.apparentTemperature),
      precipitationProbability: formatWeatherValue(
        hour?.precipitationProbability,
      ),
      precipitation: formatWeatherValue(hour?.precipitation),
      rain: formatWeatherValue(hour?.rain),
      snowfall: formatWeatherValue(hour?.snowfall),
      snowDepth: formatWeatherValue(hour?.snowDepth),
      weatherDescription,
      wind: formatWeatherWind(hour?.wind),
      pressure: formatWeatherValue(hour?.pressureMsl),
      visibility: formatWeatherValue(hour?.visibility),
      uv: formatWeatherUVValue(hour?.uv),
      cloudCover: formatWeatherValue(hour?.cloudCover),
      isDay: Boolean(hour.isDay?.value),
    };
  });
};

export const mapToCurrentWeather = (
  data: StructureWeatherData,
): CurrentWeather => {
  const firstHour: HourlyWeatherData | undefined = data.currentDay?.hourly?.[0];

  if (!firstHour) return DEFAULT_CURRENT_WEATHER;
  if (Object.keys(firstHour).length === 0) return DEFAULT_CURRENT_WEATHER;

  const timestamp = toTimestamp(firstHour.hour);

  const weatherCode = normalizeWmoWeatherCode(firstHour?.weatherCode?.value);
  const weatherDescription = getWeatherDescriptionFromWmo(weatherCode);

  const uv = formatWeatherUVValue(firstHour?.uv);
  const temperature = formatWeatherValue(firstHour?.temperature);
  const feelsLike = formatWeatherValue(firstHour?.apparentTemperature);
  const humidity = formatWeatherValue(firstHour?.relativeHumidity);
  const precipitationProbability = formatWeatherValue(
    firstHour?.precipitationProbability,
  );
  const windSpeed = formatWeatherValue(firstHour?.wind?.speed);
  const windDirection = formatWeatherValue(firstHour?.wind?.direction);
  const pressure = formatWeatherValue(firstHour?.pressureMsl);
  const visibility = formatWeatherValue(firstHour?.visibility);

  return {
    timestamp,
    temperature,
    feelsLike,
    humidity,
    precipitationProbability,
    weatherDescription,
    wind: {
      speed: windSpeed,
      direction: windDirection,
    },
    pressure,
    visibility,
    uv,
  };
};

export const mapToHourlyForecast = (
  data: StructureWeatherData,
): HourlyForecastItem[] => {
  const currentDayHours = data.currentDay?.hourly ?? [];
  const forecastDays = data.forecast ?? [];
  const seenTimestamps = new Set<number>();
  const hourlyItems: HourlyForecastItem[] = [];

  const appendHour = (hour: HourlyWeatherData) => {
    const timestamp = toTimestamp(hour.hour);
    if (seenTimestamps.has(timestamp)) return;

    const weatherCode = normalizeWmoWeatherCode(hour?.weatherCode?.value);
    const weatherDescription = getWeatherDescriptionFromWmo(weatherCode);

    const temperature = formatWeatherValue(hour?.temperature);
    const humidity = formatWeatherValue(hour?.relativeHumidity);
    const dewPoint = formatWeatherValue(hour?.dewPoint);
    const feelsLike = formatWeatherValue(hour?.apparentTemperature);
    const precipitationProbability = formatWeatherValue(
      hour?.precipitationProbability,
    );
    const precipitation = formatWeatherValue(hour?.precipitation);
    const rain = formatWeatherValue(hour?.rain);
    const snowfall = formatWeatherValue(hour?.snowfall);
    const snowDepth = formatWeatherValue(hour?.snowDepth);
    const wind = formatWeatherWind(hour?.wind);
    const pressure = formatWeatherValue(hour?.pressureMsl);
    const visibility = formatWeatherValue(hour?.visibility);
    const cloudCover = formatWeatherValue(hour?.cloudCover);
    const uv = formatWeatherUVValue(hour?.uv);
    const isDay = Boolean(hour.isDay?.value);

    seenTimestamps.add(timestamp);
    hourlyItems.push({
      timestamp,
      temperature,
      humidity,
      dewPoint,
      feelsLike,
      precipitationProbability,
      precipitation,
      rain,
      snowfall,
      snowDepth,
      weatherDescription,
      wind,
      pressure,
      visibility,
      uv,
      cloudCover,
      isDay,
    });
  };

  for (const hour of currentDayHours) {
    appendHour(hour);
    if (hourlyItems.length === 24) return hourlyItems;
  }

  for (const day of forecastDays) {
    const dayHours = day.hourly ?? [];

    for (const hour of dayHours) {
      appendHour(hour);
      if (hourlyItems.length === 24) return hourlyItems;
    }
  }

  return hourlyItems;
};

export const mapToWeeklyForecast = (
  data: StructureWeatherData,
): WeeklyForecastItem[] => {
  const previousDay = data.pastDay?.length
    ? [data.pastDay[data.pastDay.length - 1]]
    : [];

  const days: DailyWeatherData[] = [
    ...previousDay,
    ...(data.currentDay ? [data.currentDay] : []),
    ...(data.forecast ?? []),
  ];

  const seenDayTimestamps = new Set<number>();
  const uniqueDays: Array<{ dateTimestamp: number; day: DailyWeatherData }> =
    [];
  for (const day of days) {
    const dateTimestamp = toTimestamp(day.day);
    if (seenDayTimestamps.has(dateTimestamp)) continue;

    seenDayTimestamps.add(dateTimestamp);
    uniqueDays.push({ dateTimestamp, day });

    if (uniqueDays.length === 7) {
      break;
    }
  }

  return uniqueDays.map(({ dateTimestamp, day }) => {
    const hourly = mapHourlyForDay(day);

    const definedNumbers = (values: Array<number | undefined>): number[] =>
      values.filter((value): value is number => value !== undefined);
    const aggregated = (() => {
      const temps: Array<number | undefined> = [];
      const feels: Array<number | undefined> = [];
      const humidity: Array<number | undefined> = [];
      const dewPoints: Array<number | undefined> = [];
      const precProb: Array<number | undefined> = [];
      const precip: Array<number | undefined> = [];
      const rain: Array<number | undefined> = [];
      const snowfall: Array<number | undefined> = [];
      const snowDepth: Array<number | undefined> = [];
      const windSpeeds: Array<number | undefined> = [];
      const visibility: Array<number | undefined> = [];
      const uvs: Array<number | undefined> = [];

      for (const hour of hourly) {
        temps.push(hour.temperature.value);
        feels.push(hour.feelsLike.value);
        humidity.push(hour.humidity.value);
        dewPoints.push(hour.dewPoint.value);
        precProb.push(hour.precipitationProbability.value);
        precip.push(hour.precipitation.value);
        rain.push(hour.rain.value);
        snowfall.push(hour.snowfall.value);
        snowDepth.push(hour.snowDepth.value);
        windSpeeds.push(hour.wind.speed.value);
        visibility.push(hour.visibility.value);
        uvs.push(hour.uv.value);
      }

      return {
        temperatures: definedNumbers(temps),
        feelsLikeValues: definedNumbers(feels),
        humidityValues: definedNumbers(humidity),
        dewPointValues: definedNumbers(dewPoints),
        precipitationProbabilityValues: definedNumbers(precProb),
        precipitationValues: definedNumbers(precip),
        rainValues: definedNumbers(rain),
        snowfallValues: definedNumbers(snowfall),
        snowDepthValues: definedNumbers(snowDepth),
        windSpeedValues: definedNumbers(windSpeeds),
        visibilityValues: definedNumbers(visibility),
        uvValues: definedNumbers(uvs),
      };
    })();

    return {
      dateTimestamp,
      dateLabel: DAY_LABEL_FORMATTER.format(new Date(dateTimestamp)),
      hourly,
      aggregates: {
        minTemperature: makeValueUI(
          computeMin(aggregated.temperatures),
          day.temperatureMin?.unit ?? "°C",
        ),
        maxTemperature: makeValueUI(
          computeMax(aggregated.temperatures),
          day.temperatureMax?.unit ?? "°C",
        ),
        minFeelsLike: makeValueUI(computeMin(aggregated.feelsLikeValues), "°C"),
        maxFeelsLike: makeValueUI(computeMax(aggregated.feelsLikeValues), "°C"),
        minHumidity: makeValueUI(computeMin(aggregated.humidityValues), "%"),
        maxHumidity: makeValueUI(computeMax(aggregated.humidityValues), "%"),
        minDewPoint: makeValueUI(computeMin(aggregated.dewPointValues), "°C"),
        maxDewPoint: makeValueUI(computeMax(aggregated.dewPointValues), "°C"),
        maxPrecipitationProbability: makeValueUI(
          computeMax(aggregated.precipitationProbabilityValues),
          "%",
        ),
        totalPrecipitation: makeValueUI(
          aggregated.precipitationValues.reduce((sum, value) => sum + value, 0),
          "mm",
        ),
        totalRain: makeValueUI(
          aggregated.rainValues.reduce((sum, value) => sum + value, 0),
          "mm",
        ),
        totalSnowfall: makeValueUI(
          aggregated.snowfallValues.reduce((sum, value) => sum + value, 0),
          "cm",
        ),
        maxSnowDepth: makeValueUI(computeMax(aggregated.snowDepthValues), "cm"),
        sunriseTimestamp:
          day.sunrise?.value instanceof Date
            ? day.sunrise.value.getTime()
            : undefined,
        sunsetTimestamp:
          day.sunset?.value instanceof Date
            ? day.sunset.value.getTime()
            : undefined,
        daylightDurationSeconds: day.daylightDuration?.value,
        avgWindSpeed: makeValueUI(
          computeAvg(aggregated.windSpeedValues),
          "km/h",
        ),
        avgVisibility: makeValueUI(
          computeAvg(aggregated.visibilityValues),
          "m",
        ),
        maxUv: makeValueUI(computeMax(aggregated.uvValues), ""),
      },
    };
  });
};

export const mapToMonthlyForecast = (
  data: StructureWeatherData,
): MonthlyForecastItem[] => {
  const days: DailyWeatherData[] = [
    ...(data.pastDay ?? []),
    ...(data.currentDay ? [data.currentDay] : []),
    ...(data.forecast ?? []),
  ];

  const byDate = new Map<number, DailyWeatherData>();
  for (const day of days) {
    if (!(day.day?.value instanceof Date)) continue;

    const dateTimestamp = day.day.value.getTime();
    if (!byDate.has(dateTimestamp)) {
      byDate.set(dateTimestamp, day);
    }
  }

  return Array.from(byDate.entries())
    .sort(([dateA], [dateB]) => dateA - dateB)
    .map(([dateTimestamp, day]) => {
      const representativeHour = day.hourly?.[0];
      const weatherCode = normalizeWmoWeatherCode(
        representativeHour?.weatherCode?.value,
      );

      const hourly = day.hourly ?? [];
      const temperatures: number[] = [];
      const humidityValues: number[] = [];
      const precipitationProbabilityValues: number[] = [];
      const windSpeedValues: number[] = [];
      const windDirectionsBySpeed: Array<number | undefined> = [];

      for (const hour of hourly) {
        const temperature = hour.temperature?.value;
        if (temperature !== undefined) temperatures.push(temperature);

        const humidity = hour.relativeHumidity?.value;
        if (humidity !== undefined) humidityValues.push(humidity);

        const precipitationProbability = hour.precipitationProbability?.value;
        if (precipitationProbability !== undefined) {
          precipitationProbabilityValues.push(precipitationProbability);
        }

        const windSpeed = hour.wind?.speed?.value;
        if (windSpeed !== undefined) {
          windSpeedValues.push(windSpeed);
          windDirectionsBySpeed.push(hour.wind?.direction?.value);
        }
      }

      const maxWindSpeedIndex = windSpeedValues.indexOf(
        computeMax(windSpeedValues) ?? Number.NaN,
      );
      const maxWindDirectionValue =
        maxWindSpeedIndex >= 0
          ? windDirectionsBySpeed[maxWindSpeedIndex]
          : undefined;

      const minTemperature = makeValueUI(
        day.temperatureMin?.value ?? computeMin(temperatures),
        day.temperatureMin?.unit ?? "°C",
      );

      const maxTemperature = makeValueUI(
        day.temperatureMax?.value ?? computeMax(temperatures),
        day.temperatureMax?.unit ?? "°C",
      );

      return {
        dateTimestamp,
        minTemperature,
        maxTemperature,
        maxPrecipitationProbability: makeValueUI(
          computeMax(precipitationProbabilityValues),
          "%",
        ),
        maxWindSpeed: makeValueUI(computeMax(windSpeedValues), "km/h"),
        maxWindDirection: makeValueUI(maxWindDirectionValue, "°"),
        maxHumidity: makeValueUI(computeMax(humidityValues), "%"),
        weatherCode,
        weatherDescription: getWeatherDescriptionFromWmo(weatherCode),
      };
    });
};
