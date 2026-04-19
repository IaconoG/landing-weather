type WeatherMainSectionErrorProps = {
  message: string;
};

const WeatherMainSectionError: React.FC<WeatherMainSectionErrorProps> = ({
  message,
}) => {
  return (
    <div className="weather-main-section weather-main-section--error">
      <p className="weather-main-section__error-message">{message}</p>
    </div>
  );
};

export default WeatherMainSectionError;
