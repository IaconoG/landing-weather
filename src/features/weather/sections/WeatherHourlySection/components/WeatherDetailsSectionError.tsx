
type WeatherHourlySectionErrorProps = {
  message: string;
}

const WeatherHourlySectionError: React.FC<WeatherHourlySectionErrorProps> = ({ message }) => {
   return (
      <div className="weather-hourly-section weather-hourly-section--error">
        <p className="weather-hourly-section__error-message">{message}</p>
      </div>
    );
};

export default WeatherHourlySectionError;