import type {
  CurrentWeather,
  WeatherError,
} from "../../../../types/weather.types";
import WeatherDetailsSectionSkeleton from "./componnents/WeatherDetailsSectionSkeleton";
import WeatherDetailsSectionNoData from "./componnents/WeatherDetailsSectionNoData";
import WeatherDetailsSectionError from "./componnents/WeatherDetailsSectionError";
import { buildMetrics } from "./utils/buildMetrics";
import type { MetricKey } from "./utils/metricConfig";
import "./WeatherDetailsSection.css";

type WeatherDetailsSectionProps = {
  data: CurrentWeather | null;
  error: WeatherError | null;
  isLoading: boolean;
  metricKeys?: MetricKey[];
};

const WeatherDetailsSection: React.FC<WeatherDetailsSectionProps> = ({
  data,
  error,
  isLoading,
  metricKeys,
}) => {
  if (isLoading) return <WeatherDetailsSectionSkeleton />;
  if (error) return <WeatherDetailsSectionError message={error.message} />;
  if (!data) return <WeatherDetailsSectionNoData />;

  const metrics = buildMetrics(data, metricKeys);

  return (
    <div className="weather-details-section">
      <p className="weather-details-section__title">
        Detalles del tiempo sobre el día
      </p>
      <div className="weather-details-section__metrics">
        {metrics.map((metric) => (
          <article key={metric.id} className="weather-details-section__metric">
            <span className="weather-details-section__metric-label">
              {metric.label}
            </span>
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
