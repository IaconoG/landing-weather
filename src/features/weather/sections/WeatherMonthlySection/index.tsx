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

  if (hasNoData) {
    return (
      <WeatherMonthlySectionContent
        data={[]}
        sectionStateClass={"weather-monthly-section--placeholder"}
        contentStateClass={"weather-monthly-section__content--placeholder"}
      />
    );
  }

  return <WeatherMonthlySectionContent data={data} />;
};

export default WeatherMonthlySection;
