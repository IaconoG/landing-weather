import type { WeatherDetailsCardViewModel } from "../view-model/weatherDetails.types";

const renderSparkline = (graphData: WeatherDetailsCardViewModel["graph"]) => {
  if (!graphData) return <span>No data</span>;
  // Placeholder implementation for sparkline rendering
  // In a real implementation, you would use a library like 'react-sparklines' or similar
  // now return placeolherd
  return <span>Placeholder</span>;
};

type WeatherDetailsSectionContentProps = {
  cards: WeatherDetailsCardViewModel[];
  isPlaceholder: boolean;
};

const WeatherDetailsSectionContent: React.FC<
  WeatherDetailsSectionContentProps
> = ({ cards, isPlaceholder }) => {
  return (
    <section
      className={`weather-details-section ${isPlaceholder ? "weather-details-section--placeholder" : ""}`}
    >
      <p className="weather-details-section__title">
        Detalles del tiempo sobre el dia
      </p>
      <div className="weather-details-section__metrics">
        {cards.map((card) => (
          <article key={card.id} className="weather-details-section__metric">
            <span className="weather-details-section__metric-label">
              {card.label}
            </span>
            <div className="weather-details-section__metric-graph">
              {renderSparkline(card.graph)}
            </div>
            <div className="weather-details-section__metric-description">
              <span className="weather-details-section__metric-text">
                {card.description}
              </span>
              <span className="weather-details-section__metric-value">
                {card.value}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default WeatherDetailsSectionContent;
