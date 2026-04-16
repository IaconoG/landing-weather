type WeatherMonthlySectionErrorProps = {
  message: string;
};

const WeatherMonthlySectionError: React.FC<WeatherMonthlySectionErrorProps> = ({
  message,
}) => {
  return (
    <div className="weather-monthly-section weather-monthly-section--error">
      <p className="weather-monthly-section__error-message">{message}</p>
    </div>
  );
};

export default WeatherMonthlySectionError;
