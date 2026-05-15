import { useMemo } from "react";
import type {
  CurrentWeather,
  WeatherError,
} from "../../../../types/weather.types";
import {
  WeatherMainSectionContent,
  WeatherMainSectionSkeleton,
} from "./components";
import { buildMainSectionViewModel } from "./view-model/buildMainSectionViewModel";
import { PLACEHOLDER_VIEW_MODEL } from "./view-model/weatherMain.placeholder";

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
  const shouldShowPlaceholder = Boolean(error) || !data;

  const viewModel = useMemo(
    () =>
      shouldShowPlaceholder
        ? PLACEHOLDER_VIEW_MODEL
        : buildMainSectionViewModel(data),
    [data, shouldShowPlaceholder],
  );

  if (isLoading) return <WeatherMainSectionSkeleton />;

  return <WeatherMainSectionContent data={viewModel} />;
};

export default WeatherMainSection;
