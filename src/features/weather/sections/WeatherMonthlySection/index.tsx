import type {
  WeatherError,
  MonthlyForecastItem,
} from "../../../../types/weather.types";
import WeatherMonthlySectionContent from "./components/WeatherMonthlySectionContent";
import WeatherMonthlySectionNoData from "./components/WeatherMonthlySectionNoData";
import WeatherMonthlySectionError from "./components/WeatherMonthlySectionError";
import WeatherMonthlySectionSkeleton from "./components/WeatherMonthlySectionSkeleton";
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
  if (!data) return <WeatherMonthlySectionNoData />;

  return <WeatherMonthlySectionContent data={data} />;
};

export default WeatherMonthlySection;
