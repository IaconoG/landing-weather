const WeatherDetailsSectionNoData: React.FC = () => {
  return (
    <div className="weather-details-section weather-details-section--empty">
      <p className="weather-details-section__title">Detalles del tiempo sobre el día</p>
      <div className="weather-details-section__metrics">
        <article className="weather-details-section__metric">
          <span className="weather-details-section__metric-label">Humedad</span>
          <div className="weather-details-section__metric-graph" />
          <div className="weather-details-section__metric-description">
            <span className="weather-details-section__metric-text">Sin datos disponibles</span>
            <span className="weather-details-section__metric-value">--%</span>
          </div>
        </article>
        <article className="weather-details-section__metric">
          <span className="weather-details-section__metric-label">Viento</span>
          <div className="weather-details-section__metric-graph" />
          <div className="weather-details-section__metric-description">
            <span className="weather-details-section__metric-text">Sin datos disponibles</span>
            <span className="weather-details-section__metric-value">-- km/h</span>
          </div>
        </article>
        <article className="weather-details-section__metric">
          <span className="weather-details-section__metric-label">Presión</span>
          <div className="weather-details-section__metric-graph" />
          <div className="weather-details-section__metric-description">
            <span className="weather-details-section__metric-text">Sin datos disponibles</span>
            <span className="weather-details-section__metric-value">-- hPa</span>
          </div>
        </article>
        <article className="weather-details-section__metric">
          <span className="weather-details-section__metric-label">Visibilidad</span>
          <div className="weather-details-section__metric-graph" />
          <div className="weather-details-section__metric-description">
            <span className="weather-details-section__metric-text">Sin datos disponibles</span>
            <span className="weather-details-section__metric-value">-- km</span>
          </div>
        </article>
        <article className="weather-details-section__metric">
          <span className="weather-details-section__metric-label">Índice UV</span>
          <div className="weather-details-section__metric-graph" />
          <div className="weather-details-section__metric-description">
            <span className="weather-details-section__metric-text">Sin datos disponibles</span>
            <span className="weather-details-section__metric-value">--</span>
          </div>
        </article>
      </div>
    </div>
  );
};

export default WeatherDetailsSectionNoData;