import type { WeatherError } from "../../../../types/weather.types";
import {
  WeatherDetailsSectionContent,
  WeatherDetailsSectionSkeleton,
} from "./components";
import {
  buildWeatherDetailsPlaceholderSourceDay,
  buildWeatherDetailsSourceDay,
} from "./view-model/weatherDetails.source.builder";
import type { WeatherDetailsSectionData } from "./view-model/weatherDetails.source.types";
import "./WeatherDetailsSection.css";

type WeatherDetailsSectionProps = {
  data: WeatherDetailsSectionData;
  error: WeatherError | null;
  isLoading: boolean;
};

const WeatherDetailsSection: React.FC<WeatherDetailsSectionProps> = ({
  data,
  error,
  isLoading,
}) => {
  if (isLoading) return <WeatherDetailsSectionSkeleton />;

  const sourceDay = buildWeatherDetailsSourceDay(data);
  const hasNoData = Boolean(error) || !sourceDay;

  return (
    <WeatherDetailsSectionContent
      data={hasNoData ? buildWeatherDetailsPlaceholderSourceDay() : sourceDay!}
      sectionStateClass={
        hasNoData ? "weather-details-section--placeholder" : ""
      }
      contentStateClass={
        hasNoData ? "weather-details-section__content--placeholder" : ""
      }
    />
  );
};

export default WeatherDetailsSection;
