import type {
  StructureWeatherData,
  HourlyWeatherData,
  DailyWeatherData,
} from "@i-giann/open-meteo-wrapper";
import type {
  CurrentWeather,
  HourlyForecastItem,
  WeeklyForecastItem,
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
  const forecastHours = (data.forecast ?? []).flatMap(
    (day) => day.hourly ?? [],
  );

  const merged = [...currentDayHours, ...forecastHours];

  const byTimstampMap = new Map<number, HourlyWeatherData>();

  for (const hour of merged) {
    const timestamp = toTimestamp(hour.hour);
    if (!byTimstampMap.has(timestamp)) {
      byTimstampMap.set(timestamp, hour);
    }
  }

  return [...byTimstampMap.entries()]
    .sort((tsA, tsB) => tsA[0] - tsB[0])
    .slice(0, 24)
    .map(([timestamp, hour]) => ({
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
    }));
};

export const mapToWeeklyForecast = (
  data: StructureWeatherData,
): WeeklyForecastItem[] => {
  const days: DailyWeatherData[] = [
    ...(data.currentDay ? [data.currentDay] : []),
    ...(data.forecast ?? []),
  ];

  const uniqueByDayMap = new Map<number, DailyWeatherData>();

  for (const day of days) {
    const dayTs = toTimestamp(day.day);
    if (!uniqueByDayMap.has(dayTs)) {
      uniqueByDayMap.set(dayTs, day);
    }
  }

  return [...uniqueByDayMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .slice(0, 7)
    .map(([dateTimestamp, day]) => {
      const hourlyByCode = new Map<number, number>();
      const hourlyForecasts = day.hourly ?? [];

      for (const hour of hourlyForecasts) {
        const code = hour.weatherCode?.value ?? 0;
        hourlyByCode.set(code, (hourlyByCode.get(code) ?? 0) + 1);
      }
      const dominantWeatherCode =
        [...hourlyByCode.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ??
        undefined;

      const representativeHour =
        hourlyForecasts.find((hour) => hour.weatherCode?.value !== undefined) ??
        hourlyForecasts[0];

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
          hourlyForecasts.length > 0
            ? Math.max(
                ...hourlyForecasts.map(
                  (hour) => hour.precipitationProbability?.value ?? 0,
                ),
              )
            : undefined,
      };
    });
};
