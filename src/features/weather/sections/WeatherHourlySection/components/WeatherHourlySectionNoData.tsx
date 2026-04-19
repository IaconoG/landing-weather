const WeatherHourlySectionNoData: React.FC = () => {
  return (
    <div className="weather-hourly-section weather-hourly-section--empty">
      <p className="weather-hourly-section__title">Pronostico por horas</p>
      <div className="weather-hourly-section__content weather-hourly-section__content--empty">
        <p className="weather-hourly-section__empty-message">
          No hay datos horarios para la ubicacion seleccionada.
        </p>
      </div>
    </div>
  );
};

export default WeatherHourlySectionNoData;