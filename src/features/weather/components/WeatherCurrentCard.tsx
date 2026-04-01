import type { CurrentWeather, WeatherError } from "../../../types/weather.types";
import WeatherSkeleton from "./WeatherSkeleton";
import "./WeatherCurrentCard.css";

type WeatherCurrentCardProps = {
  data: CurrentWeather | null;
  error: WeatherError | null;
  isLoading: boolean;
}


  

const WeatherCurrentCard: React.FC<WeatherCurrentCardProps> = ({ data, error, isLoading }) => {
  if (isLoading) {
    return <WeatherSkeleton />;
  }

  if (error) {
    return (
      <div className="weather-current-card weather-current-card--error">
        <p className="weather-current-card__error-message">{error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="weather-current-card weather-current-card--empty">
        <p className="weather-current-card__empty-message">Ingresa una ubicación para ver el clima</p>
      </div>
    );
  }

  return (
    <div className="weather-current-card">
      <div className="weather-current-card__main">
        <div className="weather-current-card__temperature">
          <span className="weather-current-card__temperature-value">
            {Math.round(data.temperature)}°C
          </span>
          <span className="weather-current-card__condition">
            {data.weatherDescription}
          </span>
        </div>

        <div className="weather-current-card__details">
          <div className="weather-current-card__detail">
            <span className="weather-current-card__detail-label">Sensación térmica</span>
            <span className="weather-current-card__detail-value">{Math.round(data.feelsLike)}°C</span>
          </div>
          <div className="weather-current-card__detail">
            <span className="weather-current-card__detail-label">Humedad</span>
            <span className="weather-current-card__detail-value">{data.humidity}%</span>
          </div>
          <div className="weather-current-card__detail">
            <span className="weather-current-card__detail-label">Viento</span>
            <span className="weather-current-card__detail-value">{Math.round(data.windSpeed)} km/h</span>
          </div>
          <div className="weather-current-card__detail">
            <span className="weather-current-card__detail-label">Presión</span>
            <span className="weather-current-card__detail-value">{data.pressure} hPa</span>
          </div>
          <div className="weather-current-card__detail">
            <span className="weather-current-card__detail-label">Visibilidad</span>
            <span className="weather-current-card__detail-value">{data.visibility} m</span>
          </div>
          <div className="weather-current-card__detail">
            <span className="weather-current-card__detail-label">Índice UV</span>
            <span className="weather-current-card__detail-value">{data.uv}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherCurrentCard;