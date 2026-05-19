import { useMemo } from "react";
import type {
  WeatherError,
  MonthlyForecastItem,
} from "../../../../types/weather.types";
import {
  WeatherMonthlySectionContent,
  WeatherMonthlySectionSkeleton,
} from "./components";
import "./WeatherMonthlySection.css";
import { PLACEHOLDER_MONTHLY_VIEW_MODEL } from "./view-model/weatherMonthly.placeholder";
import { buildMonthlySectionViewModel } from "./view-model/buildMonthlySectionViewModel";

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
  const shouldShowPlaceholder = Boolean(error) || !data;

  const viewModel = useMemo(() => {
    if (shouldShowPlaceholder) return PLACEHOLDER_MONTHLY_VIEW_MODEL;
    const monthlyViewModel = buildMonthlySectionViewModel(data);
    return monthlyViewModel;
  }, [shouldShowPlaceholder, data]);

  if (isLoading) return <WeatherMonthlySectionSkeleton />;

  return (
    <WeatherMonthlySectionContent
      data={viewModel}
      isPlaceholder={shouldShowPlaceholder}
    />
  );
};

export default WeatherMonthlySection;
