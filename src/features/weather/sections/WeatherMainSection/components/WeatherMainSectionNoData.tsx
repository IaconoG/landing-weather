const WeatherMainSectionNoData: React.FC = () => {
  return (
    <div className="weather-main-section weather-main-section--empty">
      <p className="weather-main-section__empty-message">
        Ingresa una ubicación para ver el clima actual.
      </p>
    </div>
  );
};

export default WeatherMainSectionNoData;