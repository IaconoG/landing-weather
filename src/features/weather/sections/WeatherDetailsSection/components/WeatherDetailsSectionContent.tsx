import type { Metric } from "../view-model/metricConfig";

type WeatherDetailsSectionContentProps = {
  metrics: Metric[];
};

const WeatherDetailsSectionContent: React.FC<WeatherDetailsSectionContentProps> = ({
  metrics,
}) => {
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

export default WeatherDetailsSectionContent;