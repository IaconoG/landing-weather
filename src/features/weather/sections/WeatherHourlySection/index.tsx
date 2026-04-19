import type {
  HourlyForecastItem,
  WeatherError,
} from "../../../../types/weather.types";
import {
  WeatherHourlySectionContent,
  WeatherHourlySectionError,
  WeatherHourlySectionNoData,
  WeatherHourlySectionSkeleton,
} from "./components";
import "./WeatherHourlySection.css";

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
  if (isLoading) return <WeatherHourlySectionSkeleton />;
  if (error) return <WeatherHourlySectionError message={error.message} />;
  if (!data || data.length === 0) return <WeatherHourlySectionNoData />;

  return <WeatherHourlySectionContent data={data} />;
};

export default WeatherHourlySection;
