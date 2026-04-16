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
import { toNumber, toTimestamp } from "./utils";

export const mapToCurrentWeather = (
  data: StructureWeatherData,
): CurrentWeather => {
  const firstHour: HourlyWeatherData | undefined = data.currentDay?.hourly?.[0];

  const weatherDescription =
    firstHour?.weatherDescription?.value ?? "Condición desconocida";

  return {
    temperature: toNumber(firstHour?.temperature),
    feelsLike: toNumber(firstHour?.apparentTemperature),
    humidity: toNumber(firstHour?.relativeHumidity),
    weatherDescription,
    windSpeed: toNumber(firstHour?.wind?.speed),
    pressure: toNumber(firstHour?.pressureMsl),
    visibility: toNumber(firstHour?.visibility),
    uv: firstHour?.uv?.value ?? 0,
    timestamp: toTimestamp(firstHour?.hour),
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

    seenTimestamps.add(timestamp);
    hourlyItems.push({
      timestamp,
      temperature: toNumber(hour.temperature),
      feelsLike: toNumber(hour.apparentTemperature),
      humidity: toNumber(hour.relativeHumidity),
      weatherCode: hour.weatherCode?.value ?? 0,
      weatherDescription:
        hour.weatherDescription?.value ?? "Condición desconocida",
      windSpeed: toNumber(hour.wind?.speed),
      pressure: toNumber(hour.pressureMsl),
      visibility: toNumber(hour.visibility),
      uv: hour.uv?.value ?? 0,
      isDay:
        hour.isDay?.value !== undefined
          ? Boolean(Math.round(hour.isDay.value))
          : undefined,
      precipitationProbability: hour.precipitationProbability?.value,
      cloudCover: hour.cloudCover?.value,
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
  const days: DailyWeatherData[] = [
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
    const hourlyByCode = new Map<number, number>();
    const hourlyForecasts = day.hourly ?? [];

    let dominantWeatherCode: number | undefined;
    let dominantWeatherCount = 0;
    let representativeHour = hourlyForecasts[0];
    let maxPrecipitationProbability = 0;

    for (const hour of hourlyForecasts) {
      const code = hour.weatherCode?.value;
      if (code !== undefined) {
        const nextCount = (hourlyByCode.get(code) ?? 0) + 1;
        hourlyByCode.set(code, nextCount);

        if (nextCount > dominantWeatherCount) {
          dominantWeatherCount = nextCount;
          dominantWeatherCode = code;
        }

        if (!representativeHour) {
          representativeHour = hour;
        }
      }

      const precipitationProbability =
        hour.precipitationProbability?.value ?? 0;
      if (precipitationProbability > maxPrecipitationProbability) {
        maxPrecipitationProbability = precipitationProbability;
      }
    }

    return {
      dateTimestamp,
      minTemperature: toNumber(day.temperatureMin),
      maxTemperature: toNumber(day.temperatureMax),
      sunriseTimestamp:
        day.sunrise?.value instanceof Date
          ? day.sunrise.value.getTime()
          : undefined,
      sunsetTimestamp:
        day.sunset?.value instanceof Date
          ? day.sunset.value.getTime()
          : undefined,
      daylightDurationSeconds: day.daylightDuration?.value,
      weatherCode: dominantWeatherCode,
      weatherDescription:
        representativeHour?.weatherDescription?.value ??
        "Condición desconocida",
      precipitationProbability:
        hourlyForecasts.length > 0 ? maxPrecipitationProbability : undefined,
    };
  });
};

export const mapToMonthlyForecast = (
  _data: StructureWeatherData,
): MonthlyForecastItem[] => {
  return undefined as unknown as MonthlyForecastItem[]; // Por implementar
};
