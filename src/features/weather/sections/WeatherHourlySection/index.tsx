import type {
  HourlyForecastItem,
  WeatherError,
} from "../../../../types/weather.types";
import type {} from "./view-model/weatherHourly.source.types";
import {
  WeatherHourlySectionContent,
  WeatherHourlySectionSkeleton,
} from "./components";
import "./WeatherHourlySection.css";
import { buildWeatherHourlySource } from "./view-model/weatherHourly.source.builder";
import { useMemo } from "react";
import { PLACEHOLDER_HOURLY_VIEW_MODEL } from "./view-model/weatherHourly.placeholder";

type WeatherHourlySectionProps = {
  data: HourlyForecastItem[] | null;
  error: WeatherError | null;
  isLoading: boolean;
};

const WeatherHourlySection: React.FC<WeatherHourlySectionProps> = ({
  data,
  error,
  isLoading,
}) => {
  const shouldShowPlaceholder = Boolean(error) || !data;

  const viewModel = useMemo(() => {
    if (shouldShowPlaceholder) return PLACEHOLDER_HOURLY_VIEW_MODEL;
    const source = buildWeatherHourlySource(data);
    if (!source) return PLACEHOLDER_HOURLY_VIEW_MODEL;
    const hourlyViewModel = buildWeatherHourlySource(data);
    return hourlyViewModel;
  }, [data, shouldShowPlaceholder]);

  if (isLoading) return <WeatherHourlySectionSkeleton />;

  return (
    <WeatherHourlySectionContent
      data={viewModel}
      isPlaceholder={shouldShowPlaceholder}
    />
  );
};

export default WeatherHourlySection;
