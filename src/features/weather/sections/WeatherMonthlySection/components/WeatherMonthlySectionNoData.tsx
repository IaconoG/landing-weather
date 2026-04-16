const WeatherMonthlySectionNoData: React.FC = () => {
  return (
    <div className="weather-monthly-section">
      <p className="weather-monthly-section__title">
        Pronóstico mensual (pendiente P2)
      </p>
      <div className="weather-monthly-section__content">
        <p className="weather-monthly-section__subtitle">
          Base conectada con datos actuales. El detalle mensual se agrega en P2.
        </p>
      </div>
    </div>
  );
};

export default WeatherMonthlySectionNoData;
