import type {
  WeeklyForecastItem,
  WeatherError,
} from "../../../../types/weather.types";
import WeatherWeeklySectionError from "./components/WeatherWeeklySectionError";
import WeatherWeeklySectionNoData from "./components/WeatherWeeklySectionNoData";
import WeatherWeeklySectionSkeleton from "./components/WeatherWeeklySectionSkeleton";
import "./WeatherWeeklySection.css";

type WeatherWeeklySectionProps = {
  data: WeeklyForecastItem[] | null;
  error: WeatherError | null;
  isLoading: boolean;
};

const WeatherWeeklySection: React.FC<WeatherWeeklySectionProps> = ({
  data,
  error,
  isLoading,
}) => {
  if (isLoading) return <WeatherWeeklySectionSkeleton />;
  if (error) return <WeatherWeeklySectionError message={error.message} />;
  if (!data) return <WeatherWeeklySectionNoData />;

  return (
    <div className="weather-weekly-section">
      <p className="weather-weekly-section__title">
        Pronóstico semanal (pendiente P2)
      </p>
      <div className="weather-weekly-section__content">
        <p className="weather-weekly-section__subtitle">
          Base conectada con datos actuales. El detalle semanal se agrega en P2.
        </p>
      </div>
    </div>
  );
};

export default WeatherWeeklySection;
