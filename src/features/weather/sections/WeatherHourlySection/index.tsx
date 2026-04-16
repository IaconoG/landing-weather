import type {
  HourlyForecastItem,
  WeatherError,
} from "../../../../types/weather.types";
import WeatherHourlySectionError from "./components/WeatherHourlySectionError";
import WeatherHourlySectionNoData from "./components/WeatherHourlySectionNoData";
import WeatherHourlySectionSkeleton from "./components/WeatherHourlySectionSkeleton";
import "./WeatherHourlySection.css";

type WeatherHourlySectionProps = {
  data: HourlyForecastItem[] | null;
  error: WeatherError | null;
  isLoading: boolean;
};

const WeatherHourlySection: React.FC<WeatherHourlySectionProps> = ({
  data: _data,
  error,
  isLoading,
}) => {
  if (isLoading) return <WeatherHourlySectionSkeleton />;
  if (error) return <WeatherHourlySectionError message={error.message} />;
  if (!_data) return <WeatherHourlySectionNoData />;

  return (
    <section className="weather-hourly-section">
      <p className="weather-hourly-section__title">Pronóstico por horas</p>
      <div className="weather-hourly-section__content">
        <div
          className="weather-hourly-section__day-carousel"
          role="list"
          aria-label="Estructura del carrusel de días del pronóstico horario"
        >
          <div className="weather-hourly-section__day-card weather-hourly-section__day-card--placeholder" />
          <div className="weather-hourly-section__day-card weather-hourly-section__day-card--placeholder" />
          <div className="weather-hourly-section__day-card weather-hourly-section__day-card--placeholder" />
          <div className="weather-hourly-section__day-card weather-hourly-section__day-card--placeholder" />
          <div className="weather-hourly-section__day-card weather-hourly-section__day-card--placeholder" />
          <div className="weather-hourly-section__day-card weather-hourly-section__day-card--placeholder" />
          <div className="weather-hourly-section__day-card weather-hourly-section__day-card--placeholder" />
        </div>

        <div className="weather-hourly-section__detail">
          <div className="weather-hourly-section__detail-header">
            <div className="weather-hourly-section__detail-title-group">
              <span className="weather-hourly-section__detail-title">
                Detalle horario
              </span>
              <span className="weather-hourly-section__detail-subtitle">
                Selecciona un día para ver su evolución de 12 horas
              </span>
            </div>
            <div className="weather-hourly-section__detail-summary">
              <span className="weather-hourly-section__detail-summary-value">
                -- / --
              </span>
              <span className="weather-hourly-section__detail-summary-label">
                Máxima / mínima
              </span>
            </div>
          </div>

          <div className="weather-hourly-section__detail-body">
            <div
              className="weather-hourly-section__chart"
              aria-label="Estructura del gráfico horario de 12 horas"
            >
              <div className="weather-hourly-section__chart-point weather-hourly-section__chart-point--placeholder" />
            </div>

            <div className="weather-hourly-section__precipitation">
              <div className="weather-hourly-section__precipitation-header">
                <p className="weather-hourly-section__precipitation-title">
                  Precipitación
                </p>
                <span className="weather-hourly-section__precipitation-summary">
                  Estructura pendiente
                </span>
              </div>

              <div className="weather-hourly-section__precipitation-list">
                <div className="weather-hourly-section__precipitation-item weather-hourly-section__precipitation-item--placeholder" />
                <div className="weather-hourly-section__precipitation-item weather-hourly-section__precipitation-item--placeholder" />
                <div className="weather-hourly-section__precipitation-item weather-hourly-section__precipitation-item--placeholder" />
                <div className="weather-hourly-section__precipitation-item weather-hourly-section__precipitation-item--placeholder" />
                <div className="weather-hourly-section__precipitation-item weather-hourly-section__precipitation-item--placeholder" />
                <div className="weather-hourly-section__precipitation-item weather-hourly-section__precipitation-item--placeholder" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeatherHourlySection;
