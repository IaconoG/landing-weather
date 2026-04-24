import type {
  HourlyForecastItem,
  WeatherError,
} from "../../../../types/weather.types";
import {
  WeatherHourlySectionContent,
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
  const hasNoData = Boolean(error) || !data || data.length === 0;

  if (isLoading) return <WeatherHourlySectionSkeleton />;

  return (
    <WeatherHourlySectionContent
      data={hasNoData ? [] : data}
      sectionStateClass={hasNoData ? "weather-hourly-section--placeholder" : ""}
      contentStateClass={
        hasNoData ? "weather-hourly-section__content--placeholder" : ""
      }
    />
  );
};

export default WeatherHourlySection;
