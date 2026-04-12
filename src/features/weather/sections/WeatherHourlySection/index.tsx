import type {
  HourlyForecastItem,
  WeatherError,
} from "../../../../types/weather.types";
import WeatherHourlySectionError from "./components/WeatherDetailsSectionError";
import WeatherHourlySectionNoData from "./components/WeatherHourlySectionNoData";
import WeatherHourlySectionSkeleton from "./components/WeatherHourlySectionSkeleton";
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
  if (isLoading) return <WeatherHourlySectionSkeleton />;
  if (error) return <WeatherHourlySectionError message={error.message} />;
  if (!data) return <WeatherHourlySectionNoData />;

  return (
    <div className="weather-hourly-section">
      <p className="weather-hourly-section__title">
        Pronóstico por horas (pendiente P2)
      </p>
      <div className="weather-hourly-section__content">
        <p className="weather-hourly-section__subtitle">
          Base conectada con datos actuales. El detalle horario se agrega en P2.
        </p>
      </div>
    </div>
  );
};

export default WeatherHourlySection;
