import type { CurrentWeather, WeatherError } from "../../../../types/weather.types";
import WeatherHourlySectionSkeleton from "./WeatherHourlySectionSkeleton";
import "./WeatherHourlySection.css";

type WeatherHourlySectionProps = {
  data: CurrentWeather | null;
  error: WeatherError | null;
  isLoading: boolean;
};

const WeatherHourlySection: React.FC<WeatherHourlySectionProps> = ({
  data,
  error,
  isLoading,
}) => {
  if (isLoading) return <WeatherHourlySectionSkeleton />;

  if (error) {
    return (
      <div className="weather-hourly-section weather-hourly-section--error">
        <p className="weather-hourly-section__error-message">{error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="weather-hourly-section weather-hourly-section--empty">
        <p className="weather-hourly-section__empty-message">
          Pronóstico por horas disponible en el próximo paso.
        </p>
      </div>
    );
  }

  return (
    <div className="weather-hourly-section">
      <p className="weather-hourly-section__title">Pronóstico por horas (pendiente P2)</p>
      <div className="weather-hourly-section__content">
        <p className="weather-hourly-section__subtitle">
          Base conectada con datos actuales. El detalle horario se agrega en P2.
        </p>
      </div>
    </div>
  );
};

export default WeatherHourlySection;