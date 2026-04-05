import type { CurrentWeather } from "../../../../../types/weather.types";

type WeatherMainSectionProps = {
  data: CurrentWeather;
}


const WeatherMainSectionContent: React.FC<WeatherMainSectionProps> = ({ data }) => {
  return (
    <div className="weather-main-section-content">
      <p className="weather-main-section__title">Clima actual</p>
        <div className="weather-main-section__temperature">
          <span className="weather-main-section__temperature-value">
            {Math.round(data.temperature)}°C
          </span>
        </div>
        <div className="weather-main-section__description">
          <span className="weather-main-section__description-value">
            {data.weatherDescription}
          </span>
          <span className="weather-main-section__sensation">
            Sensación térmica: {Math.round(data.feelsLike)}°C
          </span>
        </div>
        <div className="weather-main-section__metrics">
          <div className="weather-main-section__metric">
            <span className="weather-main-section__metric-label">Humedad</span>
            <span className="weather-main-section__metric-value">{data.humidity}%</span>
          </div>
          <div className="weather-main-section__metric">
            <span className="weather-main-section__metric-label">Viento</span>
            <span className="weather-main-section__metric-value">{Math.round(data.windSpeed)} km/h</span>
          </div>
          <div className="weather-main-section__metric">
            <span className="weather-main-section__metric-label">Presión</span>
            <span className="weather-main-section__metric-value">{data.pressure} hPa</span>
          </div>
          <div className="weather-main-section__metric">
            <span className="weather-main-section__metric-label">Visibilidad</span>
            <span className="weather-main-section__metric-value">{data.visibility} m</span>
          </div>
        </div>
    </div>
  )
}

export default WeatherMainSectionContent;
