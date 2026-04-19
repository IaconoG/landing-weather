const WeatherMonthlySectionNoData: React.FC = () => {
  return (
    <div className="weather-monthly-section weather-monthly-section--empty">
      <p className="weather-monthly-section__title">Pronostico mensual</p>
      <div className="weather-monthly-section__content weather-monthly-section__content--empty">
        <p className="weather-monthly-section__empty-message">
          No hay datos mensuales para la ubicacion seleccionada.
        </p>
      </div>
    </div>
  );
};

export default WeatherMonthlySectionNoData;
