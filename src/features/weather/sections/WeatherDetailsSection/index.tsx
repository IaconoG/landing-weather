import type {
  CurrentWeather,
  WeatherError,
} from "../../../../types/weather.types";
import {
  WeatherDetailsSectionContent,
  WeatherDetailsSectionError,
  WeatherDetailsSectionNoData,
  WeatherDetailsSectionSkeleton,
} from "./components";
import { buildMetrics } from "./view-model/buildMetrics";
import type { MetricKey } from "./view-model/metricConfig";
import "./WeatherDetailsSection.css";

type WeatherDetailsSectionProps = {
  data: CurrentWeather | null;
  error: WeatherError | null;
  isLoading: boolean;
  metricKeys?: MetricKey[];
};

const WeatherDetailsSection: React.FC<WeatherDetailsSectionProps> = ({
  data,
  error,
  isLoading,
  metricKeys,
}) => {
  if (isLoading) return <WeatherDetailsSectionSkeleton />;
  if (error) return <WeatherDetailsSectionError message={error.message} />;
  if (!data) return <WeatherDetailsSectionNoData />;

  const metrics = buildMetrics(data, metricKeys);
  if (metrics.length === 0) return <WeatherDetailsSectionNoData />;

  return <WeatherDetailsSectionContent metrics={metrics} />;
};

export default WeatherDetailsSection;
