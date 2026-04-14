type WeatherWeeklySectionErrorProps = {
  message: string;
};

const WeatherWeeklySectionError: React.FC<WeatherWeeklySectionErrorProps> = ({
  message,
}) => {
  return (
    <div className="weather-weekly-section weather-weekly-section--error">
      <p className="weather-weekly-section__error-message">{message}</p>
    </div>
  );
};

export default WeatherWeeklySectionError;
