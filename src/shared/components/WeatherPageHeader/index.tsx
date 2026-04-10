import LocationControlsSection from "../../../features/location/LocationControlsSection";
import "./WeatherPageHeader.css";

const WeatherPageHeader: React.FC = () => {
  return (
    <header className="weather-header">
        <h1 className="weather-title">Weather App</h1>
        <LocationControlsSection />
      </header>
  )
}

export default WeatherPageHeader;