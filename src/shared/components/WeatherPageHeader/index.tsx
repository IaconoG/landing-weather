import LocationControlsSection from "../../../features/location/sections";
import "./WeatherPageHeader.css";

const WeatherPageHeader: React.FC = () => {
  return (
    <header className="weather-header">
      <LocationControlsSection />
    </header>
  );
};

export default WeatherPageHeader;
