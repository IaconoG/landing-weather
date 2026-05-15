import { useMemo } from "react";
import type { WeatherError } from "../../../../types/weather.types";
import {
  WeatherDetailsSectionContent,
  WeatherDetailsSectionSkeleton,
} from "./components";
import "./WeatherDetailsSection.css";
import {
  buildDetailsCards,
  buildDetailsSectionViewModel,
  buildWeatherDetailsSource,
  PLACEHOLDER_DETAILS_VIEW_MODEL,
  type WeatherDetailsSectionData,
} from "./view-model";

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
  const shouldShowPlaceholder = Boolean(error) || !data || !data.hourly.length;
  const viewModel = useMemo(() => {
    if (shouldShowPlaceholder) return PLACEHOLDER_DETAILS_VIEW_MODEL;
    const source = buildWeatherDetailsSource(data);
    console.log("Built detailsSource", { source });
    if (!source) return PLACEHOLDER_DETAILS_VIEW_MODEL;
    const detailsViewModel = buildDetailsSectionViewModel(source);
    return buildDetailsCards(detailsViewModel, shouldShowPlaceholder);
  }, [data, shouldShowPlaceholder]);

  if (isLoading) return <WeatherDetailsSectionSkeleton />;
  return (
    <WeatherDetailsSectionContent
      cards={viewModel}
      isPlaceholder={shouldShowPlaceholder}
    />
  );
};

export default WeatherDetailsSection;
