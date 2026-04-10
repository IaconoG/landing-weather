
type WeatherDetailsSectionErrorProps = {
  message: string;
}

const WeatherDetailsSectionError: React.FC<WeatherDetailsSectionErrorProps> = ({ message }) => {
  return (
      <div className="weather-details-section weather-details-section--error">
        <p className="weather-details-section__error-message">{message}</p>
      </div>
    );
};

export default WeatherDetailsSectionError;
