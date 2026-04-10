/* types */
import type { CurrentWeather, WeatherError } from "../../../../types/weather.types";
/* components */
import {
  WeatherMainSectionContent,
  WeatherMainSectionError,
  WeatherMainSectionNoData,
  WeatherMainSectionSkeleton,
} from "./components";
/* styles */
import "./WeatherMainSection.css";

type WeatherMainSectionProps = {
  data: CurrentWeather | null;
  error: WeatherError | null;
  isLoading: boolean;
};

const WeatherMainSection: React.FC<WeatherMainSectionProps> = ({ data, error, isLoading }) => {
  if (isLoading) return <WeatherMainSectionSkeleton />;
  if (error) return <WeatherMainSectionError message={error.message} />;
  if (!data) return <WeatherMainSectionNoData />;

  return <WeatherMainSectionContent data={data} />;
};
      

export default WeatherMainSection;