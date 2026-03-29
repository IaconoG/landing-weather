import LocationHeaderControls from "../../features/location/components/LocationHeaderControls";

const WeatherPageHeader: React.FC = () => {
  return (
    <header className="weather-header">
        <h1 className="weather-title">Weather App</h1>
        <h2 className="weather-subtitle">Tu Clima Local</h2>
        <LocationHeaderControls />
      </header>
  )
}

export default WeatherPageHeader;