import type {
  WeatherError,
  MonthlyForecastItem,
} from "../../../../types/weather.types";
import {
  WeatherMonthlySectionContent,
  WeatherMonthlySectionError,
  WeatherMonthlySectionNoData,
  WeatherMonthlySectionSkeleton,
} from "./components";
import "./WeatherMonthlySection.css";

type WeatherMonthlySectionProps = {
  data: MonthlyForecastItem[] | null;
  error: WeatherError | null;
  isLoading: boolean;
};

const WeatherMonthlySection: React.FC<WeatherMonthlySectionProps> = ({
  data,
  error,
  isLoading,
}) => {
  if (isLoading) return <WeatherMonthlySectionSkeleton />;
  if (error) return <WeatherMonthlySectionError message={error.message} />;
  if (!data || data.length === 0) return <WeatherMonthlySectionNoData />;

  return <WeatherMonthlySectionContent data={data} />;
};

export default WeatherMonthlySection;
