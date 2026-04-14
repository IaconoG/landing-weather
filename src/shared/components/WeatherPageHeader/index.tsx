import LocationControlsSection from "../../../features/location/LocationControlsSection";
import "./WeatherPageHeader.css";

const WeatherPageHeader: React.FC = () => {
  return (
    <header className="weather-header">
      <LocationControlsSection />
    </header>
  );
};

export default WeatherPageHeader;
