/* types */
import type {
  CurrentWeather,
  WeatherError,
} from "../../../../types/weather.types";
/* components */
import {
  WeatherMainSectionContent,
  WeatherMainSectionError,
  WeatherMainSectionNoData,
  WeatherMainSectionSkeleton,
} from "./components";
import { buildMainSectionViewModel } from "./view-model/buildMainSectionViewModel";
/* styles */
import "./WeatherMainSection.css";

type WeatherMainSectionProps = {
  data: CurrentWeather | null;
  error: WeatherError | null;
  isLoading: boolean;
};

const WeatherMainSection: React.FC<WeatherMainSectionProps> = ({
  data,
  error,
  isLoading,
}) => {
  if (isLoading) return <WeatherMainSectionSkeleton />;
  if (error) return <WeatherMainSectionError message={error.message} />;
  if (!data) return <WeatherMainSectionNoData />;

  const viewModel = buildMainSectionViewModel(data);

  return <WeatherMainSectionContent viewModel={viewModel} />;
};

export default WeatherMainSection;
