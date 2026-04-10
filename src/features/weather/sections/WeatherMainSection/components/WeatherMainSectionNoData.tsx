const WeatherMainSectionNoData: React.FC = () => {
  return (
    <div className="weather-main-section-content weather-main-section-content--nodata" aria-label="Sin datos de clima">
      <p className="weather-main-section__title">Clima actual</p>
      <div className="weather-main-section__temperature">
        <span className="weather-main-section__temperature-value">--°C</span>
      </div>
      <div className="weather-main-section__description">
        <span className="weather-main-section__description-value">Sin ubicacion seleccionada</span>
        <span className="weather-main-section__sensation">Sensacion termica: --°C</span>
      </div>
      <div className="weather-main-section__metrics">
        <div className="weather-main-section__metric">
          <span className="weather-main-section__metric-label">Humedad</span>
          <span className="weather-main-section__metric-value">--%</span>
        </div>
        <div className="weather-main-section__metric">
          <span className="weather-main-section__metric-label">Viento</span>
          <span className="weather-main-section__metric-value">-- km/h</span>
        </div>
        <div className="weather-main-section__metric">
          <span className="weather-main-section__metric-label">Presion</span>
          <span className="weather-main-section__metric-value">-- hPa</span>
        </div>
        <div className="weather-main-section__metric">
          <span className="weather-main-section__metric-label">Visibilidad</span>
          <span className="weather-main-section__metric-value">-- m</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherMainSectionNoData;