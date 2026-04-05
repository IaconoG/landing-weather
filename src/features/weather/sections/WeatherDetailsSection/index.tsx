import type { CurrentWeather, WeatherError } from "../../../../types/weather.types";
import WeatherDetailsSectionSkeleton from "./WeatherDetailsSectionSkeleton";
import "./WeatherDetailsSection.css";

type WeatherDetailsSectionProps = {
  data: CurrentWeather | null;
  error: WeatherError | null;
  isLoading: boolean;
};

type Metric = {
  id: string;
  label: string;
  value: string;
  description: string;
};

const buildMetrics = (data: CurrentWeather): Metric[] => [
  {
    id: "humidity",
    label: "Humedad",
    value: `${data.humidity}%`,
    description: "Nivel de humedad actual",
  },
  {
    id: "wind",
    label: "Viento",
    value: `${Math.round(data.windSpeed)} km/h`,
    description: "Velocidad del viento",
  },
  {
    id: "pressure",
    label: "Presión",
    value: `${data.pressure} hPa`,
    description: "Presión atmosférica",
  },
  {
    id: "visibility",
    label: "Visibilidad",
    value: `${data.visibility} km`,
    description: "Alcance visual estimado",
  },
  {
    id: "uv",
    label: "Índice UV",
    value: `${data.uv}`,
    description: "Exposición radiación UV",
  },
];

const WeatherDetailsSection: React.FC<WeatherDetailsSectionProps> = ({
  data,
  error,
  isLoading,
}) => {
  if (isLoading) return <WeatherDetailsSectionSkeleton />;

  if (error) {
    return (
      <div className="weather-details-section weather-details-section--error">
        <p className="weather-details-section__error-message">{error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="weather-details-section weather-details-section--empty">
        <p className="weather-details-section__empty-message">
          Sin datos de detalles por ahora.
        </p>
      </div>
    );
  }

  const metrics = buildMetrics(data);

  return (
    <div className="weather-details-section">
      <p className="weather-details-section__title">Detalles del tiempo sobre el día</p>
      <div className="weather-details-section__metrics">
        {metrics.map((metric) => (
          <article key={metric.id} className="weather-details-section__metric">
            <span className="weather-details-section__metric-label">{metric.label}</span>
            <div className="weather-details-section__metric-graph" />
            <div className="weather-details-section__metric-description">
              <span className="weather-details-section__metric-text">
                {metric.description}
              </span>
              <span className="weather-details-section__metric-value">
              {metric.value}
              </span>  
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default WeatherDetailsSection;