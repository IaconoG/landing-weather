const WeatherWeeklySectionNoData: React.FC = () => {
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

export default WeatherWeeklySectionNoData;
