import "./WeatherSkeleton.css";

const WeatherSkeleton: React.FC = () => {
  return (
    <div className="weather-skeleton">
      <div className="weather-skeleton__temperature">
        <div className="weather-skeleton__bar weather-skeleton__bar--lg"></div>
      </div>
      <div className="weather-skeleton__description">
        <div className="weather-skeleton__bar weather-skeleton__bar--sm"></div>
      </div>
      <div className="weather-skeleton__metrics">
        <div className="weather-skeleton__metric">
          <div className="weather-skeleton__bar weather-skeleton__bar--xs"></div>
        </div>
        <div className="weather-skeleton__metric">
          <div className="weather-skeleton__bar weather-skeleton__bar--xs"></div>
        </div>
      </div>
    </div>
  )
}

export default WeatherSkeleton