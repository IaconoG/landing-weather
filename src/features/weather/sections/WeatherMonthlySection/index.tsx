import type {
  WeatherError,
  MonthlyForecastItem,
} from "../../../../types/weather.types";
import {
  WeatherMonthlySectionContent,
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
  const hasNoData = Boolean(error) || !data || data.length === 0;

  if (isLoading) return <WeatherMonthlySectionSkeleton />;

  return (
    <WeatherMonthlySectionContent
      data={hasNoData ? [] : data}
      sectionStateClass={
        hasNoData ? "weather-monthly-section--placeholder" : ""
      }
      contentStateClass={
        hasNoData ? "weather-monthly-section__content--placeholder" : ""
      }
    />
  );
};

export default WeatherMonthlySection;
